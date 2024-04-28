import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface TodoDataObject {
    Todo_Title: string;
    Todo_Data: string;
    Current_Date: number;
    Current_Month: number;
    Current_Year: number;
    Current_Hours: number;
    Current_Minutes: number;
    Current_Day: number;
    Todo_Done_Status: boolean;
}

function HomePage() {
    const [TodoListData, SetTodoListData] = useState<string>("");
    const [TodoListDataUpdate, SetTodoListDataUpdate] = useState<string>("");
    const [Getmonth, SetMonth] = useState<string[]>([
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]);
    const [Getdays, Setdays] = useState<string[]>([
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ]);
    const [IsLoader, SetIsLoader] = useState<boolean>(true);
    const [GetTodoData, SetTodoData] = useState<TodoDataObject[]>([]);
    const [ToDoDataUpdate, SetTodoDataUpdate] = useState<boolean>(false);
    const [TodoDataUpdateId, SetTodoDataUpdateId] = useState<number>(0);
    const [TodoDataView, SetTodoDataView] = useState<boolean>(false);
    const [TodoDataViewId, SetTodoDataViewId] = useState<number>(0);

    const TodoDataAdd = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        SetIsLoader(true);
        if (TodoListData) {
            try {
                const TodayDate = new Date();
                const TodoTitle = TodoListData.substring(0, 50);
                const CurrentDate = TodayDate.getDate();
                const CurrentMonth = TodayDate.getMonth();
                const CurrentYear = TodayDate.getFullYear();
                const CurrentHours = TodayDate.getHours();
                const CurrentMinutes = TodayDate.getMinutes();
                const CurrentDay = TodayDate.getDay();
                const TodoDataObject: TodoDataObject = {
                    Todo_Title: TodoTitle,
                    Todo_Data: String(TodoListData).trim(),
                    Current_Date: CurrentDate,
                    Current_Month: CurrentMonth,
                    Current_Year: CurrentYear,
                    Current_Hours: CurrentHours,
                    Current_Minutes: CurrentMinutes,
                    Current_Day: CurrentDay,
                    Todo_Done_Status: false,
                }
                SetTodoData(prev => [...prev, TodoDataObject]);
                SetTodoListData("");
                SetIsLoader(false);

            } catch (error) {
                toast.error("Some technical issues");
                SetIsLoader(false);
            }
        } else {
            toast.warning("Please fill the todo data then save");
            SetIsLoader(false);
        }
    }

    const TodoDataUpdate = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        SetIsLoader(true);
        if (TodoListDataUpdate && TodoDataUpdateId >= 0) {
            try {
                const TodayDate = new Date();
                const TodoTitle = TodoListDataUpdate.substring(0, 50);
                const CurrentDate = TodayDate.getDate();
                const CurrentMonth = TodayDate.getMonth();
                const CurrentYear = TodayDate.getFullYear();
                const CurrentHours = TodayDate.getHours();
                const CurrentMinutes = TodayDate.getMinutes();
                const CurrentDay = TodayDate.getDay();
                const TodoDataObject: TodoDataObject = {
                    Todo_Title: TodoTitle,
                    Todo_Data: TodoListDataUpdate,
                    Current_Date: CurrentDate,
                    Current_Month: CurrentMonth,
                    Current_Year: CurrentYear,
                    Current_Hours: CurrentHours,
                    Current_Minutes: CurrentMinutes,
                    Current_Day: CurrentDay,
                    Todo_Done_Status: false,
                }
                GetTodoData[TodoDataUpdateId] = TodoDataObject;
                SetTodoData(prev => [...prev]);
                SetTodoListDataUpdate("");
                SetIsLoader(false);
                SetTodoDataUpdate(false);

            } catch (error) {
                toast.error("Some technical issues");
                SetIsLoader(false);
            }
        } else {
            toast.warning("Please fill the todo data then save");
            SetIsLoader(false);
        }
    }

    const Todo_Done_Status_Change = (id: number): void => {
        const verification = window.confirm("Are you sure to update todo status ");
        if (verification) {
            SetIsLoader(true);
            if (GetTodoData[id]?.Todo_Done_Status) {
                GetTodoData[id].Todo_Done_Status = false;
            } else {
                GetTodoData[id].Todo_Done_Status = true;
            }
            SetTodoData(prev => [...prev]);
            toast.success(`${GetTodoData[id]?.Todo_Title} Todo status update successfully`);
            SetIsLoader(false);
        }
    }

    const TodoDataListDeleted = (id: number): void => {
        const verification = window.confirm(`Are you sure to delete ${GetTodoData[id]?.Todo_Title} this todo`);
        if (verification) {
            SetIsLoader(true);
            const title = GetTodoData[id]?.Todo_Title;
            GetTodoData.splice(id, 1);
            SetTodoData(prev => [...prev]);
            if (GetTodoData.length === 0) {
                localStorage.setItem("TodoList", JSON.stringify(GetTodoData));
            }
            SetIsLoader(false);
            toast.success(`${title} Todo data deleted successfully`);
        }
    }

    const TodoDataListUpdate = (id: number): void => {
        const verification = window.confirm(`Are you sure to update ${GetTodoData[id]?.Todo_Title} this todo`);
        if (verification && id >= 0) {
            SetTodoDataUpdateId(id);
            SetTodoListDataUpdate(GetTodoData[id]?.Todo_Data);
            toast.success(`${GetTodoData[id]?.Todo_Title} Todo data updated successfully`);
            SetTodoDataUpdate(true);
        } else {
            SetTodoDataUpdate(false);
        }
    }

    const SetTodoDataViewFun = (id: number): void => {
        if (id >= 0) {
            SetTodoDataViewId(id);
            SetTodoDataView(Object(GetTodoData[id])?.Todo_Data);
        } else {
            toast.error("Some technical issue");
        }
    }

    useEffect(() => {
        if (GetTodoData.length) {
            localStorage.setItem("TodoList", JSON.stringify(GetTodoData));
        }

    }, [GetTodoData]);


    useEffect(() => {
        const TodolocalHostdataGet = localStorage.getItem("TodoList");
        if (TodolocalHostdataGet) {
            const TodolocalHostdata = JSON.parse(TodolocalHostdataGet);
            SetTodoData(TodolocalHostdata);
        }
        SetMonth([
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]);
        Setdays([
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
        ]);
        SetIsLoader(false);
        SetTodoDataUpdate(false);
    }, []);



    return (
        <>
            <section className={`${TodoDataView ? "flex" : "hidden"} w-full h-[100vh] absolute top-0 left-0 z-40  border-2 border-[#1e3648]  flex-col justify-start items-center bg-[#0b1a24d0]`}>
                <div className="w-[50%] max-lg:w-[95%]  h-[400px] flex flex-col   items-center border-[2px]  mt-12  bg-[#122634] border-[#1b3446] p-[20px] rounded-[5px]">
                    <h1 className="w-full h-[30px] p-[20px] flex justify-end items-center max-lg:pr-2">
                        <span onClick={() => { SetTodoDataView(false) }} className="material-symbols-outlined cursor-pointer select-none mt-0 mr-0">
                            close
                        </span>
                    </h1>
                    <textarea value={Object(GetTodoData[TodoDataViewId])?.Todo_Data} className="p-[10px] border-none outline-none text-[#ffffffe2] bg-[#192f40] mt-4 text-[15px] w-full h-[300px] text-wrap overflow-auto border-[2px] resize-none border-[#25465d]" />
                </div>
            </section>
            <section className={`${ToDoDataUpdate ? "flex" : "hidden"} w-full h-[100vh] absolute top-0 left-0 z-40  border-2 border-[#1e3648]  flex-col justify-start items-center bg-[#0b1a24d0]`}>
                <h1 className="w-full h-[30px] p-[20px] max-lg:pr-2 flex justify-end items-center">
                    <span onClick={() => { SetTodoDataUpdate(false) }} className="material-symbols-outlined cursor-pointer select-none mt-2 mr-2">
                        close
                    </span>
                </h1>
                <form onSubmit={TodoDataUpdate} className="w-[50%] max-lg:w-[95%] h-[400px] flex flex-col   items-center border-[2px]  mt-12  bg-[#122634] border-[#1b3446] p-[20px] rounded-[5px]">
                    <h1 className=" text-center text-[30px] w-full h-[auto] select-none pt-[10px] pb-[10px] leading-[40px] bg-transparent font-[700]">TodoList Update</h1>
                    <textarea name="" rows={8} cols={5} value={TodoListDataUpdate} onChange={(e) => { SetTodoListDataUpdate(e.target.value) }} className="p-[10px]     border-none outline-none text-[#ffffffe2] bg-[#192f40] mt-4 text-[15px] w-full border-[2px] resize-none border-[#25465d]" placeholder="Write your today Todo list minimum 4 character" />
                    <button style={{ transition: 'all 0.8s' }} disabled={TodoListDataUpdate && TodoListDataUpdate.length >= 4 ? false : true} className={`w-[100%] h-[45px] flex justify-center items-center select-none rounded-[4px]   mb-2 mt-6 ${TodoListDataUpdate && TodoListDataUpdate.length >= 4 ? "bg-[#1cb321]  text-[#fff] cursor-pointer" : "bg-[#1e394f] cursor-not-allowed text-[#ffffffad]"} `}>
                        Update
                    </button>
                </form>
            </section>
            <section className="w-[900px] max-lg:w-[700px] max-sm:w-[90%] h-[500px] max-sm:h-[90%] border-2 border-[#1e3648] shadow-inner shadow-[#1b2831]  bg-[#122634] rounded-[5px] flex flex-col justify-center items-center">
                <h1 className=" text-center text-[30px] w-full h-[auto] select-none pt-[20px] pb-[20px] leading-[40px] bg-transparent font-[700]">TodoList📝</h1>
                <form onSubmit={TodoDataAdd} className=" w-full h-full flex flex-col justify-center items-center">
                    <div className="w-[80%] h-[45px] flex  items-center border-[2px]  mt-4 bg-[#192f40] border-[#1b3446]  rounded-[5px]">
                        <input type="text" value={TodoListData} onChange={(e) => { SetTodoListData(e.target.value) }} className="p-[10px] w-full h-full bg-transparent border-none outline-none text-[#ffffffe2] text-[15px]" placeholder="Write your today Todo list minimum 4 character " />
                        <button style={{ transition: 'all 0.8s' }} disabled={TodoListData && TodoListData.length >= 4 ? false : true} className={`w-[65px] h-[100%] flex justify-center items-center select-none rounded-r-[4px]   ${TodoListData && TodoListData.length >= 4 ? "bg-[#1cb321] text-[#fff] cursor-pointer" : "bg-[#1e394f] cursor-not-allowed text-[#ffffffad]"} `}>
                            <span className="material-symbols-outlined text-[25px]">
                                add
                            </span>
                        </button>
                    </div>
                    <div id="tododatalist" className="w-[80%] h-[340px]  max-sm:h-[350px] flex  bg-[#193443] border-[2px] border-[#234455] rounded-[3px] justify-center items-start overflow-auto mt-4  mb-6 ">
                        <div className="w-[100%] h-[auto] flex flex-col  gap-2 p-3 pt-6 ">
                            {
                                IsLoader ? (
                                    <>
                                    </>
                                ) : (

                                    GetTodoData.length ? (
                                        GetTodoData?.map((TodoData, index) => (
                                            <div key={index} className="bg-[#1b3746] border-[1px] max-sm:block  rounded-[2px] border-[#204255] shadow-2xl h-[60px] w-full flex justify-start items-center p-[10px] max-sm:h-[auto] gap-2 ">
                                                {/* This is vikash kumar from gecsiwan cse(IOT) student */}
                                                <p className="w-[300px] max-lg:w-[100px] max-sm:mb-4 max-sm:w-[100%] max-sm:flex  h-[30px]  justify-between items-center gap-2">
                                                    <span className="w-[300px] max-lg:w-[100px] max-sm:w-[50px] truncate mr-2">{Object(TodoData)?.Todo_Title}</span>
                                                    <button type="button" className="bg-[#12292a] sm:hidden select-none border-[1px] border-[#1e3843] text-[#f4faff] font-[600] text-[12px] rounded-[2px] w-[150px] h-[25px] cursor-default outline-none">{Object(TodoData)?.Current_Date > 9 ? Object(TodoData)?.Current_Date : "0" + Object(TodoData)?.Current_Date} {Getmonth[Object(TodoData)?.Current_Month]} {Object(TodoData)?.Current_Year}, {Getdays[Object(TodoData)?.Current_Day]} {Object(TodoData)?.Current_Hours > 9 ? Object(TodoData)?.Current_Hours : "0" + Object(TodoData)?.Current_Hours}:{Object(TodoData)?.Current_Minutes > 9 ? Object(TodoData)?.Current_Minutes : "0" + Object(TodoData)?.Current_Minutes}</button>
                                                </p>
                                                <div className="flex justify-end items-center gap-2">
                                                    <button type="button" onClick={() => { SetTodoDataViewFun(index) }} className="bg-[#2db92b] select-none text-[#0d161d] font-[600] text-[12px] rounded-[2px] w-[50px] h-[25px] cursor-pointer  outline-none">View</button>
                                                    <input type="checkbox" onChange={() => { Todo_Done_Status_Change(Number(index)) }} checked={Object(TodoData)?.Todo_Done_Status} className=" w-6 h-6  select-none text-blue-600 bg-gray-100 border-gray-300 rounded-[10px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ml-2 mr-2 cursor-pointer outline-none" />
                                                    <button type="button" className="bg-[#12292a] max-sm:hidden select-none border-[1px] border-[#1e3843] text-[#f4faff] font-[600] text-[12px] rounded-[2px] w-[150px] h-[25px] cursor-default outline-none">{Object(TodoData)?.Current_Date > 9 ? Object(TodoData)?.Current_Date : "0" + Object(TodoData)?.Current_Date} {Getmonth[Object(TodoData)?.Current_Month]} {Object(TodoData)?.Current_Year}, {Getdays[Object(TodoData)?.Current_Day]} {Object(TodoData)?.Current_Hours > 9 ? Object(TodoData)?.Current_Hours : "0" + Object(TodoData)?.Current_Hours}:{Object(TodoData)?.Current_Minutes > 9 ? Object(TodoData)?.Current_Minutes : "0" + Object(TodoData)?.Current_Minutes}</button>
                                                    <button type="button" onClick={() => { TodoDataListUpdate(Number(index)) }} className="bg-[#fffc3e] select-none text-[#0d161d] font-[600] text-[12px] rounded-[2px] w-[40px] h-[25px] cursor-pointer  ml-2 outline-none">
                                                        <span className="material-symbols-outlined text-[18px] flex justify-center items-center">
                                                            edit
                                                        </span>
                                                    </button>
                                                    <button type="button" onClick={() => { TodoDataListDeleted(Number(index)) }} className="bg-[#ef3655] select-none text-[#ffffff] font-[600] text-[12px] rounded-[2px] w-[40px] h-[25px] cursor-pointer  ml-2 outline-none">
                                                        <span className="material-symbols-outlined text-[18px] flex justify-center items-center">
                                                            delete
                                                        </span>
                                                    </button>


                                                </div>
                                            </div>
                                        ))

                                    ) : (
                                        <div className="  h-[300px] w-full flex justify-start items-center p-[10px] ">
                                            <h1 className=" text-center text-[30px] w-full h-[auto] select-none pt-[20px] pb-[20px] leading-[40px] bg-transparent font-[700]">No Todo Data</h1>

                                        </div>
                                    )
                                )

                            }
                        </div>
                    </div>
                </form>
            </section>
        </>
    )
}

export default HomePage
