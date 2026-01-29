export const INPUT_CODE_SEARCH = `const [search, setSearch] = useState('');

<InputLib
  placeholder="Rechercher..."
  value={search}
  onChange={setSearch}
/>`;

export const INPUT_CODE_WITH_LABEL = `<InputLib
  label="Nom"
  placeholder="Entrez un nom"
  value={name}
  onChange={setName}
/>`;

export const INPUT_CODE_FILTER = `<InputLib
  className="w1/2"
  label="Filtrer par ville"
  placeholder="Paris, Lyon..."
  value={filter}
  onChange={setFilter}
/>`;

export const INPUT_CODE_DISABLED = `<InputLib
  label="Lecture seule"
  value="Read only value"
  onChange={() => {}}
  disabled
/>`;