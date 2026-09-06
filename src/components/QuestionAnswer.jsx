import Answer from "./Answer";

const QuestionAnswer = ({ item, index }) => {

  return (
    <>
      <div
        key={index + Math.random}
        className={item.type == "q" ? "flex justify-end" : ""}
      >
        {item.type == "q" ? (
          <li
            key={index + Math.random}
            className="flex items-center px-4 py-2 dark:bg-zinc-700 bg-red-100 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-fit"
          >
            <Answer
              ans={item.text}
              totalResult={1}
              index={index}
              type={item.type}
            />
          </li>
        ) : (
          item.text.map((ansItem, ansIndex) => (
            <li key={ansIndex} className="text-left p-1">
              <Answer
                ans={ansItem}
                totalResult={item.length}
                type={item.type}
                index={ansIndex}
              />
            </li>
          ))
        )}
      </div>
    </>
  );
};

export default QuestionAnswer;
