const CommentSeed = [
    {
        onwer_id : 1,
        post_id: 1,
        contents: "Very excited about the event..."
    },
    {
        onwer_id : 2,
        post_id: 1,
        contents: "cant wait to see the event...",
        reply_comment_id:1
    },
    {
        onwer_id : 2,
        post_id: 5,
        contents: "Very excited about the event..."
    },
    {
        onwer_id : 3,
        post_id: 1,
        contents: "testing testing"
    },
    {
        onwer_id : 6,
        post_id: 1,
        contents: "这个是个测试",
        replied_to: "Kaifeng99890@gmail.com",
        reply_comment_id:1
    },
 ];
 
 module.exports = CommentSeed;