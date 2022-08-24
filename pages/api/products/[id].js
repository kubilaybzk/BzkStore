import Product from "../../../models/Products";
import db from "../../../utils/db"


//db içine bağlanıp verileri db'den çekiyor.
//Input Id:
//Return Product.

const handler=async(req,res)=>{
    await db.connect();
    const product=await Product.findById(req.query.id);
    console.log(product);
    await db.disconnect();
    res.send(product);
    }

export default handler;
