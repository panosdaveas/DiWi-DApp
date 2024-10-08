
import { useWallet } from "@/app/Context/WalletContext";
import { CustomContext } from "@/app/Context/context";
import { useContractInteraction } from "@/app/scripts/interact";
import {
    Button,
    Card,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import { useContext, useState, useEffect } from "react";
import { ClipboardDefault } from "./clipboard";

const ContractDataTable = () => {

    useEffect(() => {
        localStorage.getItem('darkMode');
    }, []);

    const { data, setData } = useContext(CustomContext);
    const { walletInfo } = useWallet();
    const {
        loading,
        error,
        fetchOwner,
        fetchContract,
        requestPublicKey,
        getPublicKey,
    } = useContractInteraction();
    const [tableData, setTableData] = useState({
        owner: "",
        publicKey: "",
        contractAddress: "",
        requestStatus: "",
    });
    const [targetAddress, setTargetAddress] = useState("");
    const [targetAddressGetPK, setTargetAddressGetPK] = useState("");

    const handleFetchOwner = async () => {
        // const owner = walletInfo.address;
        const owner = await fetchOwner();
        setTableData((prev) => ({ ...prev, owner }));
    };

    const handleFetchContract = async () => {
        const result = await fetchContract();
        const contractAddress = result.contractAddress;
        setTableData((prev) => ({ ...prev, contractAddress}));
        setTableData((prev) => ({
            ...prev,
            requestStatusRequestContract: result.success
                ? <a
                    href={result.blockExplorerUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                >View in block explorer</a>
                : "Request failed",
        }));
    };

    const handleGetPublicKey = async () => {
        if (!targetAddressGetPK) return;
        const success = await getPublicKey(
            targetAddressGetPK,
            "Fetching the public key"
        );
        const publicKey = success;
        setTableData((prev) => ({ ...prev, publicKey }));
        setTableData((prev) => ({
            ...prev,
            requestStatusGetPK: publicKey ? "Successful call" : "Call failed",
        }));

        setData((prevData) => ({
            ...prevData,
            publicKey: publicKey,
        }));
    };

    const handleRequestPublicKey = async () => {
        if (!targetAddress) return;
        const result = await requestPublicKey(targetAddress, "Requesting your public key");
        setTableData((prev) => ({
            ...prev,
            requestStatusRequestPK: result.success
                ? <a
                    href={result.blockExplorerUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                >View in block explorer</a>
                : "Request failed",
        }));
    };

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    const classes = "p-4 border-b border-blue-gray-50";

    return (
        <div className="h-full w-full overflow-scroll py-4 shadow-none rounded-none border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark">
            {/* <Card className="w-full max-w-[1000px] mx-auto overflow-scroll"> */}
            <div className="p-4">
                <Typography
                    variant="h5"
                    // color="blue-gray"
                    className="mb-4 px-3"
                >
                    Contract Data Dashboard
                </Typography>
                <Card className="h-full w-full overflow-scroll border border-gray-300 px-6">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    // color="blue-gray"
                                    className="font-bold leading-none"
                                >
                                    Function
                                </Typography>
                            </th>
                            <th className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    // color="blue-gray"
                                    className="font-bold leading-none"
                                >
                                    Return
                                </Typography>
                            </th>
                            <th className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    // color="blue-gray"
                                    className="font-bold leading-none"
                                ></Typography>
                            </th>
                            <th className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    // color="blue-gray"
                                    className="font-bold leading-none"
                                >
                                    Status
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50" >
                            <td className={classes}>
                                <Button
                                    // variant="text"
                                    className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading}
                                    onClick={handleFetchContract}
                                >
                                    {loading ? <Spinner className="h-4 w-4" /> : "Fetch Contract"}
                                </Button>
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    // color="blue-gray"
                                    className="overflow-hidden overflow-ellipsis"
                                >
                                    {tableData.contractAddress || "-"}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <ClipboardDefault content={tableData.contractAddress} />
                            </td>
                            <td className="p-4">
                                <Typography variant="small">
                                    {tableData.requestStatusRequestContract || "-"}
                                </Typography>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50" >
                            <td className="py-4">
                                <Button
                                    // variant="text"
                                    className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading}
                                    onClick={handleFetchOwner}
                                >
                                    {loading ? <Spinner className="h-4 w-4" /> : "Fetch Owner"}
                                </Button>
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    // color="blue-gray"
                                    className="overflow-hidden overflow-ellipsis"
                                >
                                    {tableData.owner || "-"}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <ClipboardDefault content={tableData.owner} />
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50" >
                            <td className="py-4">
                                <Button
                                    // variant="text"
                                    className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading || !targetAddress}
                                    onClick={handleRequestPublicKey}
                                >
                                    {loading ? (
                                        <Spinner className="h-4 w-4" />
                                    ) : (
                                        "Request Public Key"
                                    )}
                                </Button>
                            </td>
                            <td className="p-4">
                                <Input
                                    type="text"
                                    variant="standard"
                                    placeholder="Enter target address"
                                    label="Target Address"
                                    value={targetAddress}
                                    onChange={(e) => setTargetAddress(e.target.value)}
                                    color={
                                        typeof window !== 'undefined' ?
                                        (localStorage.getItem("darkMode") === "true"
                                            ? "white"
                                            : "gray"
                                     ) : null
                                    }
                                    // className="border rounded p-2 mr-2 before:content-none after:content-none overflow-hidden overflow-ellipsis text-text-light dark:text-text-dark"
                                    className="p-2 mr-2 before:content-none after:content-none overflow-hidden overflow-ellipsis"
                                />
                            </td>
                            <td className="p-4">
                                <ClipboardDefault content={targetAddress} />
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                // color="blue-gray"
                                >
                                    {tableData.requestStatusRequestPK || "-"}
                                </Typography>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50" >
                            <td className="py-4">
                                <Button
                                    // variant="text"
                                    className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading || !targetAddressGetPK}
                                    onClick={handleGetPublicKey}
                                >
                                    {loading ? <Spinner className="h-4 w-4" /> : "Get Public Key"}
                                </Button>
                            </td>
                            <td className="p-4 max-w-[100px] ">
                                <Input
                                    type="text"
                                    variant="standard"
                                    placeholder="Enter target address"
                                    label="Target Address"
                                    value={targetAddressGetPK}
                                    onChange={(e) => setTargetAddressGetPK(e.target.value)}
                                    color={
                                            typeof window !== 'undefined' ?
                                                (localStorage.getItem("darkMode") === "true"
                                                    ? "white"
                                                    : "gray"
                                                ) : null
                                        }
                                    // className="border rounded p-2 mr-2 before:content-none after:content-none overflow-hidden overflow-ellipsis text-text-light dark:text-text-dark"
                                    className="p-2 mr-2 before:content-none after:content-none overflow-hidden overflow-ellipsis"
                                />
                                {/* <Typography variant="small" 
                                className="overflow-hidden overflow-ellipsis">   
                                    {tableData.publicKey || '-'}
                                </Typography> */}
                            </td>
                            <td className="p-4">
                                <ClipboardDefault content={targetAddressGetPK} />
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                // color="blue-gray"
                                >
                                    {tableData.requestStatusGetPK || "-"}
                                </Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </Card>
            </div>
        </div>
    );
};

export { ContractDataTable };
