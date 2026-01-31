"use client"

import { ToggleSwitchLib } from "@/app/component-library/molecules/toggle-switch/toggle-switch-lib";

export const TOGGLE_CODE_SIZES = `const [isSmall, setIsSmall] = useState(false);
const [isMedium, setIsMedium] = useState(false);

<div className="flex gap-6 items-center">
  <ToggleSwitchLib
    isActive={isSmall}
    onToggle={() => setIsSmall(!isSmall)}
    label="Small"
    size="small"
  />
  <ToggleSwitchLib
    isActive={isMedium}
    onToggle={() => setIsMedium(!isMedium)}
    label="Medium"
    size="medium"
  />
</div>`;

export const TOGGLE_CODE_WITHOUT_LABEL = `const [isActive, setIsActive] = useState(false);

<ToggleSwitchLib 
  isActive={isActive}
  onToggle={() => setIsActive(!isActive)}
/>`;

export const TOGGLE_CODE_WITH_LABEL = `const [isBluetoothOn, setIsBluetoothOn] = useState(true);

<ToggleSwitchLib 
  isActive={isBluetoothOn}
  onToggle={() => setIsBluetoothOn(!isBluetoothOn)}
  label="Bluetooth"
/>`;

export const TOGGLE_CODE_WITH_TRIGGER = `const [isNotificationsOn, setIsNotificationsOn] = useState(false);

<ToggleSwitchLib 
  isActive={isNotificationsOn}
  onToggle={() => {
    setIsNotificationsOn(!isNotificationsOn);
    alert(isNotificationsOn ? 'Désactivé!' : 'Activé!');
  }}
  label="Notifications"
/>
<p>État: {isNotificationsOn ? 'Activé ✅' : 'Désactivé ❌'}</p>`;

// Fonction qui retourne les sections à afficher
export const getToggleSwitchSections = (
    isSmall: boolean,
    setIsSmall: (value: boolean) => void,
    isMedium: boolean,
    setIsMedium: (value: boolean) => void,
    isWifiOn: boolean,
    setIsWifiOn: (value: boolean) => void,
    isBluetoothOn: boolean,
    setIsBluetoothOn: (value: boolean) => void,
    isNotificationsOn: boolean,
    setIsNotificationsOn: (value: boolean) => void
) => [
    {
        title: "Sizes",
        code: TOGGLE_CODE_SIZES,
        component: (
            <div className="flex gap-6 items-center">
                <ToggleSwitchLib
                    isActive={isSmall}
                    onToggle={() => setIsSmall(!isSmall)}
                    label="Small"
                    size="small"
                />
                <ToggleSwitchLib
                    isActive={isMedium}
                    onToggle={() => setIsMedium(!isMedium)}
                    label="Medium"
                    size="medium"
                />
            </div>
        )
    },
    {
        title: "Sans label",
        code: TOGGLE_CODE_WITHOUT_LABEL,
        component: (
            <ToggleSwitchLib
                isActive={isWifiOn}
                onToggle={() => setIsWifiOn(!isWifiOn)}
            />
        )
    },
    {
        title: "Avec label",
        code: TOGGLE_CODE_WITH_LABEL,
        component: (
            <ToggleSwitchLib
                isActive={isBluetoothOn}
                onToggle={() => setIsBluetoothOn(!isBluetoothOn)}
                label="Bluetooth"
            />
        )
    },
    {
        title: "Avec effet (trigger)",
        code: TOGGLE_CODE_WITH_TRIGGER,
        component: (
            <div className="space-y-2">
                <ToggleSwitchLib
                    isActive={isNotificationsOn}
                    onToggle={() => setIsNotificationsOn(!isNotificationsOn)}
                    label="Notifications"
                />
                <p className="text-sm">{`État : ${isNotificationsOn ? 'Activé ✅' : 'Désactivé ❌'}`}</p>
            </div>
        )
    }
];