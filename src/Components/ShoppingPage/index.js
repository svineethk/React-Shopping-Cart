import React , {useState,useEffect} from 'react';
import './index.css'
import { IoMdCloseCircle } from "react-icons/io";

const PRODUCTS = [
    {id:1, name:"Laptop", price:500},
    {id:2, name:"Smartphone", price:300},
    {id:3, name:"Headphones", price:100},
    {id:4, name:"Smartwatch", price:150}
]

const FREE_GIFT = {id:99, name:"Wireless Mouse", price:0}
const THRESHOLD = 1000;

const ShoppingPage = () => {
    const [products, setProducts] = useState(PRODUCTS.map(product => ({...product,quantity:0})));
    const [cart,setCart] = useState([]);
    const [freeGiftAdded, setFreeGiftAdded] = useState(false);
    const [progress, setProgress] = useState(0);

    const calculateSubtotal = (items) => {
        return items.reduce((total,item) => total + item.price * item.quantity,0);
    }

    useEffect(() => {
        const subtotal = calculateSubtotal(cart);
        setProgress(Math.min(subtotal,THRESHOLD));

        if(subtotal >= THRESHOLD && !freeGiftAdded){
            setCart(prevCart => [...prevCart,{...FREE_GIFT, quantity:1}]);
            setFreeGiftAdded(true);
        }else if(subtotal < THRESHOLD && freeGiftAdded){
            setCart(prevCart => prevCart.filter(items => items.id !== FREE_GIFT.id))
            setFreeGiftAdded(false);
        }

    }, [cart, freeGiftAdded]);
    

    const onClickHandleAddtoCart = (productId) => {

        const productToAdd = products.find(product => product.id === productId);

        if(productToAdd.quantity === 0){
            setProducts((prevProducts) => prevProducts.map(product => product.id === productId
                ? {...product,quantity: product.quantity + 1} : product
            ))
        }
        else{
            setProducts((prevProducts) => prevProducts.map(product => product.id === productId
                ? {...product,quantity: product.quantity} : product
            ))
        }

        const existingCartItem = cart.find(item => item.id === productId)

        if(existingCartItem){
            if(productToAdd.quantity > 0){
                setCart((prevCart) => prevCart.map(item => item.id === productId ?
                    {...item, quantity:productToAdd.quantity} :item
                ))
            }
        }else{
            if(productToAdd.quantity === 0){
                setCart((prevCart) => [...prevCart,{...productToAdd,quantity:1}])
            }
        }
    }

    const onCloseCartProduct = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
        setProducts((prevProducts) => prevProducts.map(product => product.id === productId
            ? {...product,quantity:0}:product
        ))
    }

    const onAddQuantity = (productId) => {
        setProducts((prevProducts) => prevProducts.map(item => item.id === productId
            ? {...item, quantity:item.quantity + 1} : item
        ))
    }

    const onReduceQuantity = (productId) => {

        const productQuantity = products.find(item => item.id === productId).quantity;
        if(productQuantity >= 1){
            setProducts((prevProducts) => prevProducts.map(item => item.id === productId
                ? {...item, quantity:item.quantity - 1} : item
            ))
        }
    }


    const onAddQuantityOnCart = (productId) => {

        const existingCartItem = cart.find(item => item.id === productId);

        if(existingCartItem){
            setCart((prevCart) => prevCart.map(item => item.id === productId ?
                {...item, quantity:item.quantity + 1} :item
            ))
        }
    }

    const onReduceQuantityOnCart = (productId) => {

        const existingCartItem = cart.find(item => item.id === productId);

        if(existingCartItem && existingCartItem.quantity === 1){
            setCart((prevCart) => prevCart.filter(item => item.id !== productId));
            setProducts((prevProducts) => prevProducts.map(item => item.id === productId
                ? {...item,quantity:0} :item
            ))
        }

        else if(existingCartItem && existingCartItem.quantity > 1){
            setCart((prevCart) => prevCart.map(item => item.id === productId ?
                {...item, quantity:item.quantity - 1} :item
        ))
        }
    }



    return(
        <div className='shopping-container'>
            <div className='container'>
                <h1 className='section-title'>Shopping Cart</h1>
                <h1 className='section-product'>Products</h1>
                <div className='product-collections'>
                    {products.map((product) => (
                        <div className='product-item' key={product.id}>
                            <h1 className='each-product'>{product.name}</h1>
                            <div className='row-container-price'>
                                <h4>₹{product.price}</h4>
                                <div className='actions-container'>
                                    <button className='minus-button' onClick={() => onReduceQuantity(product.id)}>-</button>
                                    <span className='quantity'>{product.quantity}</span>
                                    <button className='add-button' onClick={() => onAddQuantity(product.id)}>+</button>
                                </div>

                            </div>
                            <button className='add-cart-button' onClick={() => onClickHandleAddtoCart(product.id)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
                <h1 className='section-product'>Cart Summary</h1>
                <div className='cart-collections'>
                    <div className='row-container'>
                        <h1>Subtotal:</h1>
                        <h1>₹{calculateSubtotal(cart)}</h1>
                    </div>
                    {progress < THRESHOLD ? (
                        <div className='discount-container'>
                            <p>Add ₹{1000 - progress} more to get a FREE Wireless Mouse!</p>
                            <div className='progress-container'>
                                <div className='progress-bar' style={{width:`${(progress / THRESHOLD) * 100}%`, backgroundColor:'#4080ff', height:'100%', borderRadius:'12px',
                                 transition :'width 0.5s ease-in-out, background-color 0.5s ease-in-out'}}></div>
                            </div>
                    </div>
                    ) : (
                        <p className='section-paragraph'>You got a free Wireless Mouse!</p>
                    )}
                </div>
                
                {cart.length === 0 ? (
                    <div className='empty-cart-container'>
                        <h4 className='empty-header'>Your Cart is Empty</h4>
                        <p className='empty-paragraph'>Add Some Products to see them here!</p>
                    </div>) : (
                        <>
                            <h1 className='section-product'>Cart Items</h1>
                            {cart.map((cartProduct) => (
                                <div className='cart-item-container' key={cartProduct.id}>
                                    <div className='name-price-container'>
                                        <h2 className='cart-header'>{cartProduct.name}</h2>
                                        <p className='cart-paragraph'>₹{cartProduct.price} x {cartProduct.quantity} = ₹{cartProduct.price * cartProduct.quantity}</p>
                                    </div>
                                    {cartProduct.id !== FREE_GIFT.id ? (
                                        <div className='action-price-container'>
                                        <button className='cart-minus-button' onClick={() => onReduceQuantityOnCart(cartProduct.id)}>-</button>
                                        <span className='quantity'>{cartProduct.quantity}</span>
                                        <button className='cart-add-button' onClick={() => onAddQuantityOnCart(cartProduct.id)}>+</button>
                                        <div className='close-icon'>
                                        <button type='button' className='close-button' onClick={() => onCloseCartProduct(cartProduct.id)}>
                                            <IoMdCloseCircle  className = "icon"/></button>
                                    </div>
                                    </div>
                                    ) : (
                                        <div className='action-price-container'>
                                            <div className='gift-card-container'><span className='gift-name'>FREE GIFT</span></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
            </div>
        </div>
    )

}

export default ShoppingPage