const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).reject((err)=> next(err));
    }
}

export {asyncHandler}





// const asyncHandler = (asyncFn) => {}
// const asyncHandler = (asyncFn) => {() => {}}
// const asyncHandler = (asyncFn) => {async () => {}}
// const asyncHandler = (asyncFn) => async () => {}

// const asyncHandler = (asyncFn) => async (req,res,next) => {
//     try {
//         await asyncFn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }