"use client"

import {CodeBlock} from "@/app/component-library/molecules/code-block/code-block";
import {ToggleSwitchLib} from "@/app/component-library/molecules/toggle-switch/toggle-switch-lib";
import {useState} from "react";
import {
    TOGGLE_CODE_SIZES,
    TOGGLE_CODE_WITH_LABEL,
    TOGGLE_CODE_WITH_TRIGGER,
    TOGGLE_CODE_WITHOUT_LABEL
} from "@/app/component-library/molecules/toggle-switch/toggle-switch-lib.constants";
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

export default function ToggleSwitchPage() {
    const [isWifiOn, setIsWifiOn] = useState(false);
    const [isBluetoothOn, setIsBluetoothOn] = useState(true);
    const [isNotificationsOn, setIsNotificationsOn] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [isMedium, setIsMedium] = useState(false);

    return (
        <div>
            <PageHeaderLib
                title="Toggle Switch"
                subtitle="Composant toggle switch style iOS pour activer/désactiver des options"
            />

            <div className="space-y-8">
                <div>
                    <h3>Sizes</h3>
                    <div className="mt-4">
                        <CodeBlock code={TOGGLE_CODE_SIZES}>
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
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Sans label</h3>
                    <div className="mt-4">
                        <CodeBlock code={TOGGLE_CODE_WITHOUT_LABEL}>
                            <ToggleSwitchLib
                                isActive={isWifiOn}
                                onToggle={() => setIsWifiOn(!isWifiOn)}
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec label</h3>
                    <div className="mt-4">
                        <CodeBlock code={TOGGLE_CODE_WITH_LABEL}>
                            <ToggleSwitchLib
                                isActive={isBluetoothOn}
                                onToggle={() => setIsBluetoothOn(!isBluetoothOn)}
                                label="Bluetooth"
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec effet (trigger)</h3>
                    <div className="mt-4">
                        <CodeBlock code={TOGGLE_CODE_WITH_TRIGGER}>
                            <div className="space-y-2">
                                <ToggleSwitchLib
                                    isActive={isNotificationsOn}
                                    onToggle={() => {
                                        setIsNotificationsOn(!isNotificationsOn);
                                    }}
                                    label="Notifications"
                                />
                                <p className="text-sm">{`État : ${isNotificationsOn ? 'Activé ✅' : 'Désactivé ❌'}`}</p>
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    );
}