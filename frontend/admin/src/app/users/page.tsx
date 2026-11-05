'use client'

import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, InputNumber, InputRef, Modal, Space, Table, TableColumnType} from "antd";
import type {FilterDropdownProps} from "antd/es/table/interface";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {changeUser, getAllUsers} from "@/app/users/api";
import {LoadingItem} from "@/app/components/loading";
import {useNav} from "@/app/navigation/context";
import {EditIcon} from "@/app/bank/edit";
import {DataType, DataIndex} from "@/app/users/types";
import {ModalUser} from "@/app/users/modal";



export default function PageUsers() {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {setShowNavigation, setActive} = useNav()

    useEffect(() => {
        getAllUsers().then(users => {
            setShowNavigation(true)
            setActive("/users")
            setLoading(true)

            // @ts-ignore
            setData(users.map((user) => ({ ...user, key: user.id, banned: user.banned ? "Да" : "Нет" })))
        })
    }, []);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
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
            (record[dataIndex] ? record[dataIndex] : "").toString().toLowerCase().includes((value as string).toLowerCase()),
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
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 70,
            render: (_: any, record: DataType) => (record.avatar ? <a href={record.avatar} target={"_blank"}><img src={record.avatar} alt={"avatar"} width={32} height={32} className={"rounded-full"}/></a> : <p></p>)
        },
        {
            title: 'id',
            key: 'id',
            dataIndex: 'key',
            ...getColumnSearchProps('id'),
            width: 200
        },
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
            ...getColumnSearchProps('username'),
            width: 200
        },
        {
            title: 'Голда',
            dataIndex: 'gold_coins',
            key: 'gold_coins',
            defaultSortOrder: 'descend',
            sorter: (a: DataType, b: DataType) => a.gold_coins - b.gold_coins,
            width: 200
        },
        {
            title: 'Серебро',
            dataIndex: 'silver_coins',
            key: 'silver_coins',
            defaultSortOrder: 'descend',
            sorter: (a: DataType, b: DataType) => a.silver_coins - b.silver_coins,
            width: 200
        },
        {
            title: 'Бан?',
            dataIndex: 'banned',
            key: 'banned',
            defaultSortOrder: 'descend',
            sorter: (a: DataType, b: DataType) => a.banned == b.banned ? 1 : -1,
            width: 100
        },
        {
            title: 'Дата регистрации',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 300
        },
        {
            title: 'Реферал',
            dataIndex: 'referrer_id',
            key: 'referrer_id',
            width: 200,
            ...getColumnSearchProps('referrer_id'),
        },
        {
            title: <EditIcon/>,
            key: 'action',
            render: (_: any, record: DataType) => (
                <span className={"flex w-full items-center justify-center cursor-pointer"} onClick={() => {showModal(record.id)}}>
                    <EditIcon/>
                </span>
            ),
            width: 50,
        }
    ];
    const [open, setOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<DataType>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [valueGold, setValueGold] = useState<number>(currentUser?.gold_coins ? currentUser?.gold_coins : 0);
    const [valueSilver, setValueSilver] = useState<number>(currentUser?.silver_coins ? currentUser?.silver_coins : 0);
    const [banned, setBanned] = useState<boolean>(currentUser?.banned == "Да");

    useEffect(() => {
        setValueGold(currentUser?.gold_coins ? currentUser?.gold_coins : 0);
        setValueSilver(currentUser?.silver_coins ? currentUser?.silver_coins : 0);
        setBanned(currentUser?.banned == "Да")
    }, [currentUser]);

    const showModal = (userId: number) => {
        setCurrentUser(data.find((user) => user.id === userId));
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        changeUser(currentUser?.id as number, currentUser?.gold_coins as number, currentUser?.silver_coins as number, currentUser?.banned === "Да").then(() => {
            setData(prevState => {
                return prevState.map((user) => (user.id === currentUser?.id ? { ...currentUser } : user))
            });
            setConfirmLoading(false)
            setOpen(false);
        })
    };

    const handleCancel = () => {
        setOpen(false);
    };
    return (
        loading ?
            <div className="section flex-col">
                <h1 className={"text-[32px] mb-2 ml-3"}>Все пользователи</h1>
                <Table<DataType> dataSource={data} columns={columns as never[]} pagination={false} sticky={true} scroll={{x: 1600, y: "70vh"}}/>
                <Modal
                    title={`Управление пользователем ${currentUser?.username ? `@${currentUser?.username}` : currentUser?.id}`}
                    open={open}
                    onOk={handleOk}
                    okText={"Сохранить"}
                    cancelText={"Отменить"}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <ModalUser user={currentUser as DataType} setUser={setCurrentUser}/>
                </Modal>
            </div>
            :
            <LoadingItem/>
    );
}