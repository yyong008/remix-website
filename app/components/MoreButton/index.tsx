export default function Button({ children }: any) {
  return (
    <button className="text-gray-300 leading-[40px] bg-gray-800 px-[30px] rounded-[10px]">
      {children}
    </button>
  );
}
