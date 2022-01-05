import callAPI from './callAPI';
import cstoreUpload from '@cvte/cstore-upload';

export const uploadToCDN = async (file, onProgress) => {
  if (typeof file === 'string') {
    return callAPI('', { customUrl: `teaching-plan/convert-api/convertToCDN`, url: file });
  }

  return new Promise(async (resolve, reject) => {
    try{
      const policyRes = await callAPI('GET_UPLOAD_POLICY', { appId: '10098' });
      console.log('policyRes', policyRes);
      const policy = policyRes.data.policyList[0];
      const upload = cstoreUpload(file, {
        policyList: policy,
        onComplete: res => {
          resolve(res.data);
        },
        onError: err => {
          console.log('上传失败');
          reject(err);
        },
        onProgress: ({ percent }) => {
          if (percent > 100) percent = 100;
          onProgress && onProgress(percent);
        },
      })
      await upload.start();
    } catch {
      reject('网络异常，请稍后重试')
    }
  });
}