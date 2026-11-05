'use client'
import React, {useState, useEffect, useRef} from 'react';
import {useNav} from "@/app/navigation/context";
import {Button, Input, InputRef, Space, Table, TableColumnType} from "antd";
import {Ticket, TicketIndex} from "@/app/tickets/types";
import type {FilterDropdownProps} from "antd/es/table/interface";
import {getAllTickets} from "@/app/tickets/api";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {LoadingItem} from "@/app/components/loading";

export default function PageTickets() {
    const [data, setData] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {setShowNavigation, setActive} = useNav()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: TicketIndex,
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
        getAllTickets().then(r => {
            setData(r)
            setShowNavigation(true)
            setActive("/tickets")
            setLoading(true)
        })
    }, []);

    const getColumnSearchProps = (dataIndex: TicketIndex): TableColumnType<Ticket> => ({
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
            sorter: (a: Ticket, b: Ticket) => a.id - b.id,
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
            title: 'Лот',
            key: 'lot',
            dataIndex: 'lot',
            width: 70,
            sorter: (a: Ticket, b: Ticket) => a.lot - b.lot,
            ...getColumnSearchProps('lot')
        },
        {
            title: 'Номер',
            key: 'number',
            dataIndex: 'number',
            width: 100,
            sorter: (a: Ticket, b: Ticket) => a.number - b.number,
            ...getColumnSearchProps('number')
        },
        {
            title: 'Кол-во',
            key: 'count',
            dataIndex: 'count',
            width: 70,
            sorter: (a: Ticket, b: Ticket) => a.count - b.count
        },
        {
            title: 'Тип',
            key: 'type',
            dataIndex: 'type',
            width: 100,
            sorter: (a: Ticket, b: Ticket) => a.type.length - b.type.length,
            render: (_: any, record: Ticket) => (
                <p>{record.type == "gold" ? "Золотой" : "Серебрянный"}</p>
            ),
        },
        {
            title: 'Активный',
            key: 'active',
            dataIndex: 'active',
            width: 100,
            sorter: (a: Ticket, b: Ticket) => a.active == b.active ? -1 : -1,
            render: (_: any, record: Ticket) => (
                <p>{record.active ? "Да" : "Нет"}</p>
            ),
        },
        {
            title: 'Цена',
            key: 'price',
            dataIndex: 'price',
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
                <h1 className={"text-[32px] mb-2 ml-3"}>Все билеты</h1>
                <Table<Ticket> dataSource={data} columns={columns as never[]} pagination={false} sticky={true} scroll={{x: 1600, y: "70vh"}}/>
            </div>
            :
            <LoadingItem/>
    );
};