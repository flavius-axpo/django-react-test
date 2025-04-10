import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./Button.module.css";

/**
 * Custom Button.
 * @param {Object} props - Component props
 * @param {String} props.text - Text of the button.
 * @return {Element}
 * */
function Button({ text }) {
  return (
    <button className={styles.container}>
      <CaretLeft size={32} />
      <span className={styles.text}>{text}</span>
      <CaretRight size={32} />
    </button>
  );
}

export default Button;
