export const BUTTON_CODE_VARIANTS = `<div className="flex gap-4">
  <ButtonLib text="Primary" variant="primary" />
  <ButtonLib text="Secondary" variant="secondary" />
  <ButtonLib text="Tertiary" variant="tertiary" />
</div>`;

export const BUTTON_CODE_SIZES = `<div className="flex gap-4 items-center">
  <ButtonLib text="Small" size="small" />
  <ButtonLib text="Medium" size="medium" />
  <ButtonLib text="Large" size="large" />
</div>`;

export const BUTTON_CODE_LUCIDE_ICON = `import { Plus } from "lucide-react";

<ButtonLib text="Add" icon={Plus} />`;

export const BUTTON_CODE_REACT_ICON = `import { FaUser } from "react-icons/fa";

<ButtonLib text="Profile" icon={FaUser} />`;

export const BUTTON_CODE_ON_CLICK = `const [message, setMessage] = useState('');

<ButtonLib
  text="Click Me"
  variant="primary"
  onClick={() => setMessage('Button clicked!')}
/>
{message && <p>{message}</p>}`;