import React, { useEffect, useState } from "react";

const Search = ({ list, query, setState }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log(list);
    setState(
      list.filter((item) =>
        item[query].toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, list, query, setState]);

  return (
    <div className="search">
      <label htmlFor="search">Search: </label>
      <input
        type="text"
        id="search"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
};

export default Search;
