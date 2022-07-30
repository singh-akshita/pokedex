import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonList from "./PokemonList";
import Pagination from "./Pagination";

const App = () => {
  const [pokemon, setPokemon] = useState("pikachu");
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonType, setPokemonType] = useState("");
  const [pokemonId, setPokemonId] = useState("25");
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setPokemon(e.target.value.toLowerCase());
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getPokemon();
  };
  const getPokemon = async () => {
    const toArray = [];
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
      const res = await axios.get(url);
      toArray.push(res.data);
      setPokemonType(res.data.types[0].type.name);
      setPokemonData(toArray);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(pokemonData);
  useEffect(() => {
    setLoading(true);
    let cancel;
    axios
      .get(currentPageUrl, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setLoading(false);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setPokemon(res.data.results.map((p) => p.name));
      });

    return () => cancel();
  }, [currentPageUrl]);

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }
  if (loading) return "Loading...";

  return (
    <>
      <div className="App">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              onChange={handleChange}
              placeholder="enter pokemon name"
            />
          </label>
        </form>
        {pokemonData.map((data) => {
          return (
            <div className="container">
              <img
                src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${data.id}.svg`}
              />
              <div className="divTable">
                <div className="divTableRow">
                  <div className="divTableCell">Name</div>
                  <div className="divTableCell"> {data.name.toUpperCase()}</div>

                  <div className="divTableBody">
                    <div className="divTableRow">
                      <div className="divTableCell">Type</div>
                      <div className="divTableCell">{pokemonType}</div>
                    </div>
                  </div>

                  <div className="divTableRow">
                    <div className="divTableCell">Id</div>
                    <div className="divTableCell">{data.id}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* <PokemonList pokemon={pokemon} />
        <Pagination
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        /> */}
      </div>
    </>
  );
};

export default App;
