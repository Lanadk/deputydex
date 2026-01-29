export const SELECT_CODE_BASIC = `const [country, setCountry] = useState('');

const countries = [
  { value: 'fr', label: 'France' },
  { value: 'us', label: 'États-Unis' },
  { value: 'uk', label: 'Royaume-Uni' },
];

<SelectLib
  options={countries}
  value={country}
  onChange={setCountry}
  placeholder="Choisir un pays"
/>`;

export const SELECT_CODE_WITH_LABEL = `const [city, setCity] = useState('');

const cities = [
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
];

<SelectLib
  label="Ville"
  options={cities}
  value={city}
  onChange={setCity}
  placeholder="Sélectionner une ville"
/>`;

export const SELECT_CODE_FILTER = `const [category, setCategory] = useState('');

const categories = [
  { value: 'tech', label: 'Technologie' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
];

<SelectLib
  label="Filtrer par catégorie"
  options={categories}
  value={category}
  onChange={setCategory}
  placeholder="Toutes les catégories"
/>`;

export const SELECT_CODE_DISABLED = `<SelectLib
  label="Lecture seule"
  options={countries}
  value="fr"
  onChange={() => {}}
  disabled
/>`;