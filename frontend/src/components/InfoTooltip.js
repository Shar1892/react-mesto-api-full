import PopupWithForm from "./PopupWithForm";
import successIcon from "../images/success.svg";
import failureIcon from "../images/failure.svg";

const InfoTooltip = ({ isOpen, onClose, status, mеssage }) => {
	return (
		<PopupWithForm name="auth" title="" isOpen={isOpen} onClose={onClose}>
			<img
				src={status ? successIcon : failureIcon}
				alt="Знак статуса авторизации"
				className="overlay__infoTooltip-icon"
			/>
			<p className="overlay__infoTooltip-massage">{mеssage}</p>
		</PopupWithForm>
	);
};

export default InfoTooltip;
