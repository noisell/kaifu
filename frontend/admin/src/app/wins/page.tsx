'use client'

import React, {useState, useEffect, useRef} from 'react';
import {useNav} from "@/app/navigation/context";
import {Button, Input, InputRef, Space, Table, TableColumnType} from "antd";
import type {FilterDropdownProps} from "antd/es/table/interface";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {LoadingItem} from "@/app/components/loading";
import {Win, WinIndex} from "@/app/wins/types";
import {getAllWins} from "@/app/wins/api";

export default function PageWins() {
    const [data, setData] = useState<Win[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {setShowNavigation, setActive} = useNav()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: WinIndex,
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
        getAllWins().then(r => {
            setData(r)
            setShowNavigation(true)
            setActive("/wins")
            setLoading(true)
        })
    }, []);

    const getColumnSearchProps = (dataIndex: WinIndex): TableColumnType<Win> => ({
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

    const columns = [
        {
            title: 'id',
            key: 'id',
            dataIndex: 'id',
            width: 100,
            sorter: (a: Win, b: Win) => a.id - b.id,
            defaultSortOrder: 'descend'
        },
        {
            title: 'Пользователь',
            key: 'user_id',
            dataIndex: 'user_id',
            width: 100,
            ...getColumnSearchProps('user_id')
        },
        {
            title: 'Билет id',
            key: 'ticket_id',
            dataIndex: 'ticket_id',
            width: 100,
            sorter: (a: Win, b: Win) => a.id - b.id,
            defaultSortOrder: 'descend',
            ...getColumnSearchProps('ticket_id')
        },
        {
            title: 'Тип',
            key: 'type',
            dataIndex: 'type',
            width: 100,
            sorter: (a: Win, b: Win) => a.type.length - b.type.length,
            render: (_: any, record: Win) => (
                <p>{record.type == "jackpot" ? "Джекпот" : record.type == "referrer" ? "Реферал" : "Ежедневный"}</p>
            ),
        },
        {
            title: 'Получен',
            key: 'received',
            dataIndex: 'received',
            width: 100,
            sorter: (a: Win, b: Win) => a.received == b.received ? -1 : -1,
            render: (_: any, record: Win) => (
                <p>{record.received ? "Да" : "Нет"}</p>
            ),
        },
        {
            title: 'Сумма GOLD',
            key: 'amount',
            dataIndex: 'amount',
            width: 100
        },
        {
            title: 'Дата',
            key: 'created_at',
            dataIndex: 'created_at',
            width: 200
        },

    ]

    return (
        loading ?
            <div className="section flex-col">
                <h1 className={"text-[32px] mb-2 ml-3"}>Выигрыши</h1>
                <Table<Win> dataSource={data} columns={columns as never[]} pagination={false} sticky={true} scroll={{x: 1600, y: "70vh"}}/>
            </div>
            :
            <LoadingItem/>
    );
};