const path = require('path');
var express = require('express');
const multer = require('multer');
const crypto = require('crypto');

const {
	S3Client, PutObjectCommand, GetObjectCommand,
  }  = require('@aws-sdk/client-s3');

var router = express.Router();
const upload = multer({ dest: 'uploads/' });

/* *
 *  wopi CheckFileInfo endpoint
 *
 *  Returns info about the file with the given document id.
 *  The response has to be in JSON format and at a minimum it needs to include
 *  the file name and the file size.
 *  The CheckFileInfo wopi endpoint is triggered by a GET request at
 *  https://HOSTNAME/wopi/files/<document_id>
 */
router.get('/files/:fileId', function (req, res) {
	console.log('file id: ' + req.params.fileId);
	// test.txt is just a fake text file
	// the Size property is the length of the string
	// returned by the wopi GetFile endpoint

	const user = {
		id: `user-123-${Date.now()}`,
		name: `John Doe-${Date.now()}`,
		// id: `user-123`,
		// name: `John Doe`,
		picture: 'https://media.istockphoto.com/id/614012698/photo/i-am-a-strong-woman.jpg?s=1024x1024&w=is&k=20&c=Dahswq7Z71XJqKx2SaNbYA3oByKhk4eot6vuHSSXNZQ=',
	};

	const wopiResponse = {
		// BaseFileName: `${req.params.fileId}.docx`,
		BaseFileName: `${req.params.fileId}`,
		OwnerId: 'owner-123',
		Size: 12345, // You should provide the actual file size
		UserId: user.id,
		UserFriendlyName: user.name,
		UserProfilePicture: user.picture,
		// ReadOnly: false,
		UserCanWrite: true,
		SupportsUpdate: true,
		// SupportsFileCreation: true,
		// UserCanNotWriteRelative: false,
		SupportsRename: true,
		UserCanRename: true,
		DisableAutoSave: true,
		Version: 1,
		// FileUrl: 'https://staging-23.s3.us-east-1.amazonaws.com/64f992f2f1d658840ebbe716/actual/Resume%20Info%20%281%29.docx?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIAE%2Bg%2FfnfvvwZcg3purz%2Fblf4QsBHlb1saYkH7nmiWFBAiBd9FLhH8l%2B22Ba%2BRMJY728RfAJvfDEdhUeU6kGSF9lNiroAgg%2FEAEaDDk2MTcwNzA1NDgzMCIM%2BZ11Q9NvEdeBXLfJKsUCjWrY%2F9Ro0WHtp7yL1FDbbk6dopQ%2Fqj8jvsBer7V5K16PzfJJplZUGijWoyTj2%2FkJmfA5K8562%2BSbh0He%2FHfdPB4O%2BiJAbP2KuvL1XaIy9QmvpRC0dw0Sm9Qp68ffevsrtIaTJK3HkQ14yk3UtF3n813DyhQksRveBbc8VNsLptcXf1At%2Fd6ZycARyI4CsO2wytUwLNh2lJYI%2FaHm3gwCAmoFD8eRBzSeqwh9Yd0QmwpjHTxbk0AS%2BCL4Plkz8ILEiuXTTizeuDO8gWeFnkBoGNe9cCTmm7MUa2tPlvCZ8YOGkvudVLv7I%2BIL8iUEGYzjrlXNPFf64A2rzkgymiySFdimvGW3oBkSw1U%2BUUgOBbQ7Kggu9xojqeDW6J8eVX06NIfVEgO4hLAvxkiJts4Bc4yCWyYJJWluCjXuDfZamLuPjqe5%2FjDE64O0Bjq0AuTwXFF1RYgZfXOnqZCoQ9AtlOZn%2B5XsTlUxbB1gI0gHy1YnrVxQDV7pn9IqVymutvbV%2BQOLqUGzladZ5DSQ3bl88UHhZNFz0so4IhV%2BMkgVqERcyvUIHAJ42SSCTkSK9TU%2FOlNdGa0%2F5cPiiti4FIbPdZNzco4g2B%2BLtr7hkKdXDIPGfaI4xuiU4Sr3BcQ8AUgAb5DgWZzSZN14w8kpht71mi4APUOoUbTIwHJAhGPR11sRV5ZVjidUVtQzofN2JBPJejP1P2xGFRvk2CSCB36dF0wDExbEG8TCdJlFZGKdPE39BFOHp7pfBV%2BHQlfJxkQdp9A01EwaFg8QMruqCRT40tqJS8hTSG%2FfEmS6Ar7XF3u9voIcDDA19JN4piPiSbowVtC2C%2Bypj38t%2FWfaTYsk%2BYnk&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240630T060612Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA572RVC3XPGJLUUMF%2F20240630%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=bcf3bca4ceb486780a354028fc016573f31b6690399d7b10471b7b2c4a817b8e'
	};

	// res.json({
	// 	BaseFileName: 'test.txt',
	// 	Size: 11,
	// 	UserId: 1,
	// 	UserCanWrite: true
	// });

	res.json(wopiResponse);
});

/* *
 *  wopi GetFile endpoint
 *
 *  Given a request access token and a document id, sends back the contents of the file.
 *  The GetFile wopi endpoint is triggered by a request with a GET verb at
 *  https://HOSTNAME/wopi/files/<document_id>/contents
 */
router.get('/files/:fileId/contents', async function (req, res) {
	// we just return the content of a fake text file
	// in a real case you should use the file id
	// for retrieving the file from the storage and
	// send back the file content as response

	const client = new S3Client({
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		}
	});

	const input = {
		Bucket: 'elm-core-qa',
		Key: `docreposervice-42982c97-569b-11eb-80cf-0281a3a095cb/${req.params.fileId}`,
	};
	const cmd = new GetObjectCommand(input);
	const response = await client.send(cmd);

	// await response.Body.transformToByteArray: [AsyncFunction: transformToByteArray],
    // await response.Body.transformToString: [AsyncFunction: transformToString],
    // await response.Body.transformToWebStream: [Function: transformToWebStream],
	// console.log(response)

	// var fileContent = 'Hello world!\n\nhow are you.';
	// return res.pipe(response.Body);
	return response.Body.pipe(res);
});

/* *
 *  wopi PutFile endpoint
 *
 *  Given a request access token and a document id, replaces the files with the POST request body.
 *  The PutFile wopi endpoint is triggered by a request with a POST verb at
 *  https://HOSTNAME/wopi/files/<document_id>/contents
 */
router.post('/files/:fileId/contents', async function (req, res) {
	// we log to the console so that is possible
	// to check that saving has triggered this wopi endpoint
	console.log('wopi PutFile endpoint');
	if (req.body) {
		// console.dir(req.body);
		// console.log(req.body.toString());
		const client = new S3Client();

		const input = {
			Bucket: 'staging-23',
			Key: `docreposervice-42982c97-569b-11eb-80cf-0281a3a095cb/${req.params.fileId}`,
			// Body: req.body.toString()
			Body: req.body
		};
		await client.send(new PutObjectCommand(input));
		res.sendStatus(200);
	} else {
		console.log('Not possible to get the file content.');
		res.sendStatus(404);
	}
});

router.post(
	'/files/:fileId',
	// upload.single('file'),
	async (req, res) => {
	const { fileId } = req.params;
	const { access_token } = req.query;
	const bucketName = process.env.S3_BUCKET_NAME || 'staging-23';

	// const newFileName = req.body.SuggestedFileName || `${path.basename(fileId, path.extname(fileId))}_${crypto.randomBytes(4).toString('hex')}${path.extname(fileId)}`;
	// const newFileKey = path.join(path.dirname(fileId), newFileName);
	console.log('/files/:fileId',req.body)
	// console.log('/files/:fileId',req.body.toString())
	try {

		const client = new S3Client();

		const input = {
			Bucket: 'staging-23',
			Key: `docreposervice-42982c97-569b-11eb-80cf-0281a3a095cb/${fileId}`,
			Body: req.body
		};
		await client.send(new PutObjectCommand(input));

		// const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFileKey}`;
		const fileUrl = `https://7be4-106-214-69-188.ngrok-free.app/wopi/files/${fileId}`;
		res.json({
			// Name: '123',
			Name: fileId,
			Url: fileUrl
		});
	} catch (error) {
		res.status(500).send(error.toString());
	}
});

module.exports = router;
