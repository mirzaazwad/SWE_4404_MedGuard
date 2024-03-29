const ChatSender = ({imageURL,message,datetime}) => {
  return (
    <div className="d-flex flex-row justify-content-start">
      <img
        src={imageURL}
        alt="avatar 1"
        style={{ width: "45px", height: "100%" }}
      />
      <div>
        <p
          className="small p-2 ms-3 mb-1 rounded-3"
          style={{ backgroundColor: "#f5f6f7" }}
        >
          {message}
        </p>
        <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
          {datetime}
        </p>
      </div>
    </div>
  );
};

export default ChatSender;
