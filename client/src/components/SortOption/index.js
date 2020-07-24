import React from "react";

const SortOption = ({ state, order, setState, setOrder, options }) => (
  <>
    <div className="sort__by">
      <label htmlFor="sort">Sort by: </label>
      <select
        name="sort"
        id="sort"
        onChange={(e) => setState(e.target.value.toLowerCase())}
        value={state}
      >
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase().split(" ")[0]}>
            {opt}
          </option>
        ))}
      </select>
    </div>
    <div className="sort__order">
      <label htmlFor="order">Order by: </label>
      <select
        name="order"
        id="order"
        onChange={(e) =>
          setOrder(e.target.value === "ascending" ? true : false)
        }
        value={order ? "ascending" : "descending"}
      >
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
      </select>
    </div>
  </>
);

export default SortOption;
