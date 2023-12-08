export default function Pagination({
  current = 1,
  total = 1,
  onBefore,
  onAfter,
}) {
  return (
    <div>
      <div
        onClick={() => {
          onBefore();
        }}
      >
        上一页
      </div>
      <div>
        {current}/{total}
      </div>
      <div
        onClick={() => {
          onAfter();
        }}
      >
        下一页
      </div>
    </div>
  );
}
