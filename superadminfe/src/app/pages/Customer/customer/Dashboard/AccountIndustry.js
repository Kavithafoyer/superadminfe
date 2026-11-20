import React from 'react';
import PieChart, {
    Series,
    Label,
    Connector,
    SmallValuesGrouping,
    Legend,
    Export,
    Title
} from 'devextreme-react/pie-chart';
import { BASE_URL } from 'app/services/auth-services';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Div from '@jumbo/shared/Div';

function formatLabel(arg) {
    console.log("arg", arg)
    return `${arg.argumentText}: ${arg.valueText}`;
}

function AccountIndustry() {

    const token = localStorage.getItem("accesstoken")
    const item = "crmuseradmin1";

    const [dataSource, setDataSource] = useState([])

    const FetchData = async () => {
        console.log("Account Api calling...");
        try {
            const response = await axios.get(`${BASE_URL}/superadmin/AccountdashboardNew/`, {
                headers: {
                    "db": item,
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }
            });
            const list = response?.data?.Response?.map(item => {
                const { List, ...rest } = item;
                return rest;
            });
            console.log("list1234", list);
            return list;
        } catch (error) {
            console.log("err", error);
            throw new Error('Failed to fetch data');
        }
    };

    const { data: dataSourceLists, isLoading: dataSourceListsLoading, isError: dataSourceListsError } = useQuery(['dataSourceLists', item, token], FetchData, { staleTime: Infinity });

    // if (dataSourceListsLoading) return <di>Loading...</di>

    useEffect(() => {
        if (dataSourceLists) {
            setDataSource(dataSourceLists);
        }
    }, [dataSourceLists]);

    return (
        <>
            {dataSource?.length > 0 ?
                <PieChart
                    dataSource={dataSource}
                    palette="Bright"
                    legend={{
                        visible: false // Hiding the legend
                    }}
                >
                    <Series
                        argumentField="Industry"
                        valueField="Count"
                    >
                        <Label
                            visible={true}
                            customizeText={formatLabel}
                            format="fixedPoint"
                        >
                            <Connector
                                visible={true}
                                width={0.5}
                            />
                        </Label>

                    </Series>

                    <Export enabled={true} />
                    <Title
                        text="Account by Industry"
                        font={{
                            size: 16,
                            weight: 600,
                            family: 'Lato, sans-serif'
                        }}
                        position="left"
                        horizontalAlignment="left"
                    />
                </PieChart>
                :
                <Div sx={{ minWidth: "100% !important", minHeight: "100% !important", display: "flex", justifyContent: "center", alignItems: "center" }}>No Records</Div>
            }
        </>
    );
}
export default AccountIndustry;
