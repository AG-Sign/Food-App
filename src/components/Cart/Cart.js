import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDidSubmit, setIsDidSubmt] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const confirmHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      "https://react-http-2b2fa-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          items: cartCtx.items,
        }),
      }
    );
    setIsSubmitting(false);
    setIsDidSubmt(true);
    cartCtx.clearCart()
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          price={item.price}
          amount={item.amount}
          onAdd={cartItemAddHandler.bind(null, item)}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onHideCart}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={confirmHandler} onCancel={props.onHideCart} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );
  const isSubmittingModalContent = <p>Sending order Data....</p>;
  const isDidSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order...</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onHideCart}>
        Close
      </button>
    
    </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onHideCart}>
      {!isSubmitting && !isDidSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && isDidSubmit && isDidSubmitModalContent}
    </Modal>
  );
};

export default Cart;
