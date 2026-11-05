import Image from "next/image";

export const LoadingComponent = () => {
    return (
        <div className='flex flex-col w-screen h-screen items-center justify-center'>
            <Image src={"/gold-coin.png"} alt={"Logo"} width={100} height={100} />
            <p className="text-white text-[54px] font-bold text-center">KAIFU</p>
        </div>
    )
}