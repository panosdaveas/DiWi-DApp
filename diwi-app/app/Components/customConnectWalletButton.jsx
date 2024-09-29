import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CustomContext } from "@/app/Context/context";
export const CustomConnectWalletButton = ({ onConnectData }) => {
    const { data, setData } = useContext(CustomContext);
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                const onConnected = () => {
                    onConnectData(account.address);
                };
                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} type="button">
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        onClick={openChainModal}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                className="h-5 w-5"
                                                style={{
                                                    background: chain.iconBackground,
                                                    // width: 12,
                                                    // height: 12,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        className="h-5 w-5"
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                    // style={{ width: 12, height: 12 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                    <button onClick={openAccountModal} type="button">
                                        {account.displayName}
                                        {/* {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''} */}
                                    </button>

                                </div>
                            );
                        })()}

                    data = {(accountAddress) => setData((prevData) => ({
                ...prevData,
                accountAddress: accountAddress,
        }))}
                    </div>
                );
            }
            }
        </ConnectButton.Custom>
    );
};