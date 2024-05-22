export const ForgotPasswordMessage = ({ email }) => {
  return (
    <div>
      <h4 className="text-center mb-4 pb-3 block-title">Email Sent</h4>
      <div className="msg-sent-text text-center mb-4 pb-3">
        An email with instructions on how to reset your password has been sent
        to {email}
      </div>
      <a href="/" className="btn btn-primary forgot-pass-btn btn-block mb-5">
        Back To Home
      </a>
    </div>
  );
};
