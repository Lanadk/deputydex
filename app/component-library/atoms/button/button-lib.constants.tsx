"use client"

import { ButtonLib } from "@/app/component-library/atoms/button/button-lib";
import { FaUser } from "react-icons/fa";
import { Plus } from "lucide-react";

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

export const getButtonSections = (message: string, setMessage: (msg: string) => void) => [
    {
        title: "Variants",
        code: BUTTON_CODE_VARIANTS,
        component: (
            <div className="flex gap-4 flex-wrap">
                <ButtonLib text="Primary" variant="primary" />
                <ButtonLib text="Secondary" variant="secondary" />
                <ButtonLib text="Tertiary" variant="tertiary" />
            </div>
        )
    },
    {
        title: "Sizes",
        code: BUTTON_CODE_SIZES,
        component: (
            <div className="flex gap-4 items-center flex-wrap">
                <ButtonLib text="Small" size="small" />
                <ButtonLib text="Medium" size="medium" />
                <ButtonLib text="Large" size="large" />
            </div>
        )
    },
    {
        title: "With Icon (Lucide)",
        code: BUTTON_CODE_LUCIDE_ICON,
        component: <ButtonLib text="Add" icon={Plus} />
    },
    {
        title: "With Icon (React Icons)",
        code: BUTTON_CODE_REACT_ICON,
        component: <ButtonLib text="Profile" icon={FaUser} />
    },
    {
        title: "With onClick",
        code: BUTTON_CODE_ON_CLICK,
        component: (
            <div className="space-y-2">
                <ButtonLib
                    text="Click Me"
                    variant="primary"
                    onClick={() => setMessage('Button clicked!')}
                />
                {message && (
                    <p className="text-sm">{message}</p>
                )}
            </div>
        )
    }
];