import { useNavigate } from "react-router-dom";


const ProductCard = (props) => {
    const {product}  = props; 
    const {product_id, product_title, product_category} = product;
    const navigate = useNavigate();
    
    return(
        <div className="col-4" onClick={ () => navigate(`/product/${product_id}`)}>
            <div className="card" style={{width: "18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">{product_title}</h5>
                    <p className="card-text">{product_category}</p>
                </div>
            </div>
        </div>); 
}; 
  
  
export default ProductCard;
