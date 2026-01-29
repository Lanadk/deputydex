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