'use client'
import React, {useState, useEffect, useRef} from 'react';
import Highlighter from "react-highlight-words";

import {useNav} from "@/app/navigation/context";
import {Transaction, TransactionIndex} from "@/app/transactions/types";
import {changeHistoryMoney, getAllHistoryMoney} from "@/app/transactions/api";
import {LoadingItem} from "@/app/components/loading";

import {SendTransactionRequest, useTonAddress, useTonConnectModal, useTonConnectUI} from "@tonconnect/ui-react";

import {Button, Input, InputRef, Space, Table, TableColumnType, message, ConfigProvider} from "antd";
import {CloseCircleFilled, SearchOutlined} from "@ant-design/icons";
import type {FilterDropdownProps} from "antd/es/table/interface";
import {WalletIcon} from "@/app/transactions/walletIcon";
import {TopUpIcon} from "@/app/transactions/upIcon";


export default function PageTransactions() {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {setShowNavigation, setActive} = useNav()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const address = useTonAddress();
    const [tonConnectUI] = useTonConnectUI()
    const { open } = useTonConnectModal();
    const [messageApi, contextHolder] = message.useMessage()


    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: TransactionIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    useEffect(() => {
        getAllHistoryMoney().then(r => {
            setData(r)
            setShowNavigation(true)
            setActive("/transactions")
            setLoading(true)
        })
    }, []);

    const getColumnSearchProps = (dataIndex: TransactionIndex): TableColumnType<Transaction> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            (record[dataIndex] as string).toString().toLowerCase().includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {if (open) setTimeout(() => searchInput.current?.select(), 100);},
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (text),
    });

    const error = (text: string) => {
        messageApi
            .open({
                type: 'error',
                content: text
            })
            .then(() => {})
    }
    const success = (text: string) => {
        messageApi
            .open({
                type: 'success',
                content: text

            })
            .then(() => {
                return
            })
    }

    const onClickTopUp = async (data: Transaction) => {
        if (!tonConnectUI.connected) {
            return error('Please connect your wallet')
        }
        const transaction: SendTransactionRequest = {
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
                {
                    address: data.user_wallet,
                    amount: Math.ceil(data.amount * 10 ** 9).toString()
                }
            ]
        }
        try {
            await tonConnectUI.sendTransaction(transaction)
            setData(prevState => {
                return prevState.map((item) => (item.id === data.id ? {...item, gold: -item.gold, system_wallet: `${address ? address : "unknown"}`} : {...item}))
            })
            changeHistoryMoney(data.id, address ? address : "unknown").then()
            return success(`Успешно!`)
        } catch {
            return error('Возможно на вашем счете недостаточно средств или произошла ошибка')
        }
    }

    const onClickClose = (id: number) => {
        changeHistoryMoney(id, "-1").then()
        setData(prevState => {
            return prevState.map((item) => (item.id === id ? {...item, system_wallet: "-1", gold: 0} : {...item}))
        })
    }

    const columns = [
        {
            title: 'id',
            key: 'id',
            dataIndex: 'id',
            width: 120,
            sorter: (a: Transaction, b: Transaction) => a.id - b.id,
            defaultSortOrder: 'descend',
            render: (_: any, record: Transaction) => (
                <span className="flex items-center w-full justify-between">
                    <p className={"mr-3"}>{record.id}</p>
                    {record.type == "withdraw" && record.system_wallet == null  ?
                        <span className="gap-1 flex items-center">
                            <span className="cursor-pointer" onClick={() => {onClickTopUp(record).then()}}><TopUpIcon /></span>
                            <CloseCircleFilled style={{fontSize: "19px", color: "#e84747", cursor: "pointer"}}  onClick={() => {onClickClose(record.id)}} />
                        </span>
                        : null}
                </span>
            )
        },
        {
            title: 'Статус',
            key: 'system_wallet',
            dataIndex: 'system_wallet',
            width: 150,
            sorter: (a: Transaction, b: Transaction) => a.system_wallet == b.system_wallet ? 1 : -1,

            render: (_: any, record: Transaction) => (record.system_wallet == null ? "⏳ Ожидает" : record.system_wallet == "-1" ? "❌ Отклонена" : "✅ Выполнена")
        },
        {
            title: 'Пользователь',
            key: 'user_id',
            dataIndex: 'user_id',
            width: 200,
            ...getColumnSearchProps('user_id'),
        },
        {
            title: 'Сумма TON',
            key: 'amount',
            dataIndex: 'amount',
            width: 200,
            sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
            render: (_: any, record: Transaction) => (
                record.type == "top_up" ?
                    <p className="text-green-500">+{record.amount}</p> :
                    record.system_wallet == null ?
                        <p className="text-orange-400">{record.amount}</p> :
                        record.system_wallet == "-1" ?
                            <p className={"line-through"}>{record.amount}</p> :
                            <p className="text-red-400">-{record.amount}</p>
            ),
        },
        {
            title: 'Сумма GOLD',
            key: 'gold',
            dataIndex: 'gold',
            width: 200,
            sorter: (a: Transaction, b: Transaction) => a.gold - b.gold,
        },
        {
            title: 'Тип',
            key: 'type',
            dataIndex: 'type',
            width: 200,
            sorter: (a: Transaction, b: Transaction) => a.type.length - b.type.length,
            render: (_: any, record: Transaction) => (
                <p>{record.type == "top_up" ? "Пополнение" : "Вывод"}</p>
            ),
        },
        {
            title: 'Дата',
            key: 'created_at',
            dataIndex: 'created_at',
            width: 300
        },
        {
            title: 'Кошелек пользователя',
            key: 'user_wallet',
            dataIndex: 'user_wallet',
            width: 400
        },

    ];

    return (
        loading ?
            <div className="section flex-col">
                <ConfigProvider theme={{components: {Message: {contentBg: '#F2F2F2', colorText: '#141414'}}}}>
                    {contextHolder}
                </ConfigProvider>
                <div className="flex w-full items-center gap-10">
                    {
                        address ?
                            <div className="flex ml-3 items-center py-3 px-5 bg-[#363645] rounded-[12px] gap-0.5 cursor-pointer">
                                <span className="flex"><WalletIcon white={true}/></span>
                                <p className="text-white text-[16px]" style={{lineHeight: "14px"}}>{address.substring(0, 5) + "..." + address.substring(address.length - 4)}</p>
                            </div>
                            :
                            <div className="flex ml-3 items-center py-3 px-5 bg-[#F2F2F2] rounded-[12px] gap-0.5 cursor-pointer" onClick={open}>
                                <span className="flex"><WalletIcon/></span>
                                <p className="text-black text-[16px]" style={{lineHeight: "14px"}}>Connect wallet</p>
                            </div>
                    }
                    <div className="flex items-center gap-2">
                        <p className="text-[20px] font-bold">К ВЫВОДУ:</p>
                        <p className={"text-[20px] "}>{data.reduce((sum, item) => {
                            if (item.system_wallet === null) {
                                return sum + item.amount;
                            }
                            return sum;
                        }, 0)} TON</p>
                    </div>
                </div>
                <h1 className={"text-[32px] mt-7 mb-2 ml-3"}>Все транзакции</h1>
                <Table<Transaction> dataSource={data} columns={columns as never[]} pagination={false} sticky={true} scroll={{x: 2000, y: "70vh"}}/>
            </div>
            :
            <LoadingItem/>
    );
};