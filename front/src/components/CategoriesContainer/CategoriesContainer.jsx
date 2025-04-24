import React from 'react'
import CategoryContainer from '../CategoryContainer/CategoryContainer'

const CategoriesContainer = ({ categories, category, handleCategoryClick }) => {
  return (

    <div className="container mx-auto px-3 mb-14 mt-6 max-w-7xl flex justify-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3">
        {categories.map((c , index) => (
          <CategoryContainer key={index} c={c} category={category} handleCategoryClick={handleCategoryClick} />
        ))}
      </div>
    </div>
  )
}

export default CategoriesContainer