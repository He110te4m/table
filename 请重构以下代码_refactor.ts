// 请使用优化以下代码：

// 假设已经存在以下3个函数，3个函数的功能都是向服务器上传文件，根据不同的上传类型参数都会不一样。内容的实现这里无须关注
// 请重新设计一个功能，根据不同文件的后缀名，上传到不同的服务器。
// txt 上传到 ftp
// exe 上传到 sftp
// doc 上传到 http
function uploadByFtp(file: string): Promise<boolean> {
  return new Promise((resolve) => resolve(true));
}
function uploadBySftp(file: string[], cb: (ret: boolean) => void): void {
  cb(true);
}
function uploadByHttp(file: string): boolean {
  return true;
}

// 实现如下

/** 文件上传 */
export function upload(files: string[]): Promise<boolean> {
  console.trace(getLogHeader(), 'Input files: ', files);

  const allowedFiles = getAllowedFiles(files);
  console.debug(getLogHeader(), 'Allowed files: ', allowedFiles);

  if (!allowedFiles.length) {
    console.warn(getLogHeader(), 'Allowed files is empty.', 'Ignore.');
    console.info(getLogHeader(), 'Upload completed.');
    return Promise.resolve(true);
  }

  return Promise.all(
    files.map((filename) => {
      return uploadFile(filename);
    })
  )
    .then(() => {
      console.info(getLogHeader(), 'Upload completed.');
      return true;
    })
    .catch((result) => {
      console.debug(getLogHeader(), 'Upload result: ', result);
      console.error(
        getLogHeader(),
        'Upload failed.',
        'Check upload files please.'
      );
      return false;
    });
}

/** 注册上传方式和函数的映射，仅对内部函数映射，方便外部复用 */
const uploadMethods = {
  ftp: uploadByFtp,
  sftp: uploadBySftp,
  http: uploadByHttp,
} as const;

/** 约束外部注册文件处理函数时，
 * 要么使用内置的上传函数（通过字符串传入，方便复用内部函数），
 * 要么自行配置函数，并且函数的返回值为 Promise<boolean>
 */
type AllowedExtMap = Record<
  string,
  keyof typeof uploadMethods | ((file: string) => Promise<boolean>)
>;

/** 内置了原需求的 后缀 <=> 上传函数映射 */
const allowedFilesExtensionMap: AllowedExtMap = {
  txt: 'ftp',
  exe: 'sftp',
  doc: 'http',
};

/** 添加允许的文件后缀 */
export function registerAllowedFilesExts(extMap: AllowedExtMap) {
  Object.assign(allowedFilesExtensionMap, extMap);
}

/** 提取允许上传的文件 */
function getAllowedFiles(files: string[]) {
  return files.filter((filename) => {
    return Object.keys(allowedFilesExtensionMap).includes(getFileExt(filename));
  });
}

/** 上传函数 */
function uploadFile(filename: string) {
  const ext = getFileExt(filename);
  const handler = allowedFilesExtensionMap[ext];
  return new Promise((resolve, reject) => {
    function handlerResult(res: boolean) {
      const tip = `${filename} is ${res}`;
      res ? resolve(tip) : reject(tip);
    }

    switch (handler) {
      case 'ftp':
        uploadMethods[handler](filename)
          .then((res) => {
            handlerResult(res);
          })
          .catch(() => {
            handlerResult(false);
          });
        break;
      case 'http':
        handlerResult(uploadMethods[handler](filename));
        break;
      case 'sftp':
        uploadMethods[handler]([filename], (res) => {
          handlerResult(res);
        });
        break;
      default:
        if (handler) {
          handler(filename)
            .then((res) => {
              handlerResult(res);
            })
            .catch(() => {
              handlerResult(false);
            });
        }
        break;
    }
  });
}

/** 获取文件后缀名 */
function getFileExt(filename: string) {
  const [, ext = ''] = filename.match(/\.(\w+)$/) ?? [];
  return ext;
}

/** 日志头 */
function getLogHeader() {
  return `[upload][${new Date().getTime()}]: `;
}
