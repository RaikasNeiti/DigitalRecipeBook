"use client";
import React, { useState } from "react";
import RecipeModal from "./components/RecipeModal";
import AddRecipeModal from "./components/AddRecipeModal";
import EditRecipeModal from "./components/EditRecipeModal";
import ConfirmDialog from "./components/ConfirmDialog";
import AdvancedFiltersModal, { AdvancedFilters } from "./components/AdvancedFiltersModal";
import RecipeRouletteModal from "./components/RecipeRouletteModal";
import HomeSidebar from "./components/home/HomeSidebar";
import HomeTopNav from "./components/home/HomeTopNav";
import HomeHero from "./components/home/HomeHero";
import HomeRecipesSection from "./components/home/HomeRecipesSection";
import HomeFloatingActions from "./components/home/HomeFloatingActions";
import { Recipe } from "./types/recipes";
import { useRecipeBookData } from "./hooks/useRecipeBookData";
import { useRecipeForms } from "./hooks/useRecipeForms";
import { useRecipeFiltering } from "./hooks/useRecipeFiltering";

const defaultAdvancedFilters: AdvancedFilters = {
  minCookingTime: "",
  maxCookingTime: "",
  ingredientQuery: "",
  selectedTags: [],
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [isRouletteModalOpen, setIsRouletteModalOpen] = useState(false);
  const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSidebarView, setSelectedSidebarView] = useState<"all" | "favorites">("all");
  const [selectedSidebarCategory, setSelectedSidebarCategory] = useState<string | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(defaultAdvancedFilters);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const { tags, recipes, favoriteRecipeIds, toggleFavorite, addRecipe, deleteRecipe, updateRecipe } =
    useRecipeBookData();
  const {
    formData,
    editRecipeId,
    editExistingImage,
    editFormData,
    resetAddForm,
    handleChange,
    handleEditChange,
    handleImageChange,
    handleEditImageChange,
    addIngredientField,
    removeIngredientField,
    importIngredients,
    addEditIngredientField,
    removeEditIngredientField,
    openEditModal,
    closeEditModalState,
  } = useRecipeForms();

  const { filteredRecipes, activeFilterCount } = useRecipeFiltering({
    recipes,
    searchQuery,
    advancedFilters,
    selectedSidebarCategory,
    selectedSidebarView,
    favoriteRecipeIds,
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleDiscardModal = () => {
    resetAddForm();
    handleCloseModal();
  };

  const handleOpenRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };
  const handleCloseRecipeModal = () => setIsRecipeModalOpen(false);
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    closeEditModalState();
  };

  const handleSubmit = async () => {
    try {
      const success = await addRecipe(formData);

      if (success) {
        resetAddForm();
        handleCloseModal();
        setShowAddSuccess(true);
      } else {
        alert("Failed to add recipe.");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("An error occurred while adding the recipe.");
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    try {
      const success = await deleteRecipe(id);

      if (success) {
        setConfirmDeleteId(null);
        handleCloseRecipeModal();
      } else {
        alert("Failed to delete recipe.");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("An error occurred while deleting the recipe.");
    }
  };

  const handleOpenEditModal = (recipe: Recipe) => {
    openEditModal(recipe);
    setIsRecipeModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateRecipe = async (selectedTags: string[]) => {
    if (!editRecipeId) {
      return;
    }

    await updateRecipe(editRecipeId, editFormData, selectedTags);
    handleCloseEditModal();
  };

  const quickFilterTags = tags.slice(0, 6);

  return (
    <div className="app-shell min-h-screen">
      <AdvancedFiltersModal
        isOpen={isAdvancedFilterModalOpen}
        filters={advancedFilters}
        availableTags={tags}
        onClose={() => setIsAdvancedFilterModalOpen(false)}
        onApply={setAdvancedFilters}
        onReset={() => setAdvancedFilters(defaultAdvancedFilters)}
      />

      {isModalOpen && (
        <AddRecipeModal
          formData={formData}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onAddIngredient={addIngredientField}
          onRemoveIngredient={removeIngredientField}
          onImportIngredients={importIngredients}
          availableTags={tags}
          onClose={handleCloseModal}
          onDiscard={handleDiscardModal}
          onSubmit={handleSubmit}
        />
      )}
      {isRecipeModalOpen && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isFavorited={favoriteRecipeIds.has(selectedRecipe.id)}
          onToggleFavorite={toggleFavorite}
          onClose={handleCloseRecipeModal}
          onDelete={() => setConfirmDeleteId(selectedRecipe.id)}
          onEdit={() => handleOpenEditModal(selectedRecipe)}
        />
      )}
      {isEditModalOpen && (
        <EditRecipeModal
          formData={editFormData}
          existingImage={editExistingImage}
          availableTags={tags}
          onChange={handleEditChange}
          onImageChange={handleEditImageChange}
          onAddIngredient={addEditIngredientField}
          onRemoveIngredient={removeEditIngredientField}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateRecipe}
        />
      )}
      {confirmDeleteId !== null && (
        <ConfirmDialog
          title="Delete this recipe?"
          message="This action cannot be undone."
          confirmLabel="Delete"
          tone="danger"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => handleDeleteRecipe(confirmDeleteId)}
        />
      )}
      {showAddSuccess && (
        <ConfirmDialog
          title="Recipe added"
          message="Your recipe was successfully added to the book."
          confirmLabel="OK"
          onConfirm={() => setShowAddSuccess(false)}
        />
      )}
      {isRouletteModalOpen && (
        <RecipeRouletteModal
          recipes={recipes}
          availableTags={tags}
          onClose={() => setIsRouletteModalOpen(false)}
          onViewRecipe={(recipe) => {
            setIsRouletteModalOpen(false);
            handleOpenRecipeModal(recipe);
          }}
        />
      )}

      <main className="flex min-h-screen w-full gap-4 px-3 py-3 sm:px-5 sm:py-4 lg:gap-6 lg:px-7 lg:py-5 xl:px-9 2xl:px-12">
        <HomeSidebar
          quickFilterTags={quickFilterTags}
          onOpenRoulette={() => setIsRouletteModalOpen(true)}
          selectedView={selectedSidebarView}
          onSelectView={setSelectedSidebarView}
          selectedCategory={selectedSidebarCategory}
          onSelectCategory={setSelectedSidebarCategory}
        />

        <div className="min-w-0 flex-1">
          <HomeTopNav onOpenRoulette={() => setIsRouletteModalOpen(true)} />

          <HomeHero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenFilters={() => setIsAdvancedFilterModalOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          <HomeRecipesSection
            recipes={filteredRecipes}
            favoriteRecipeIds={favoriteRecipeIds}
            onToggleFavorite={toggleFavorite}
            onOpenRecipe={(recipe) => handleOpenRecipeModal(recipe)}
          />
        </div>
      </main>

      <HomeFloatingActions onOpenAddRecipe={handleOpenModal} />
    </div>
  );
}
