import CartIcon from '../Cart/CartIcon'
import classes from './HeaderCartButton.module.css'
import { useContext ,useEffect,useState} from 'react'
import CartContext from '../../store/cart-context'

const HeaderCartButton = props =>{
    const [btnAnimated , setBtnAnimated] = useState(false)
    const cartCtx = useContext(CartContext)
    const numberOfCartItems =cartCtx.items.reduce((cur,item)=>{
        return (cur+item.amount)
    },0)
    const {items} = cartCtx
    const btnClasses = `${classes.button} ${btnAnimated ? classes.bump : ''}`

    useEffect(()=>{
        if(items.length===0){
            return
        }
        setBtnAnimated(true)
        const timer =setTimeout(()=>{setBtnAnimated(false)},300)

        return ()=>{
            clearTimeout(timer)
        }
    },[items])
    return (
        <button className={btnClasses} onClick={props.onClick}>
            <span className={classes.icon}><CartIcon/></span>
            <span>Your Cart</span>
            <span className={classes.badge}>{numberOfCartItems}</span>
        </button>
    )
}

export default HeaderCartButton