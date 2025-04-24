import Slider from "rc-slider";
import React, { useState } from "react";

const PriceRangeFilter = () => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  return (
    <div>
      <div className="space-y-6">
        <div className="p-6">
          <div className=" inset-0 flex items-center justify-center p-4">
            <div>
              <h3 className="font-semibold mb-3">Fourchette de prix (DH)</h3>
              <Slider
                range
                min={0}
                max={100000}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
                className="mb-4"
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
