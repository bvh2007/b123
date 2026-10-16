const mysql=require('mysql2/promise');
const bcrypt=require('bcryptjs');
const fs=require('fs'); const path=require('path');
require('dotenv').config({path:path.join(__dirname,'..','.env')});

async function main(){
 const cfg={host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER||'root',password:process.env.DB_PASSWORD||'',database:process.env.DB_NAME||'tailieu_sv'};
 const db=await mysql.createConnection(cfg);
 const hash=await bcrypt.hash('123456',10);
 // Demo users. Existing emails are reused safely.
 const users=[
  ['admin@tailieusv.local','admin','Quản trị viên',3],
  ['an@tailieusv.local','nguyen.an','Nguyễn Văn An',1],
  ['duc@tailieusv.local','tran.duc','Trần Minh Đức',1],
  ['nam@tailieusv.local','le.nam','Lê Hoàng Nam',1],
  ['moderator@tailieusv.local','moderator','Người kiểm duyệt',2]
 ];
 const ids={};
 for(const [email,username,name,role] of users){
   await db.query(`INSERT INTO users(role_id,username,email,password_hash,full_name) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE full_name=VALUES(full_name),role_id=VALUES(role_id),password_hash=VALUES(password_hash),deleted_at=NULL`,[role,username,email,hash,name]);
   const [[u]]=await db.query('SELECT user_id FROM users WHERE email=?',[email]); ids[email]=u.user_id;
 }
 const docs=[
  ['Giáo trình Lập trình C++ cơ bản','Lập trình','Giáo trình','Tổng hợp biến, điều kiện, vòng lặp, hàm và OOP cơ bản.',['C++','OOP','Lập trình'],42,4.8],
  ['SQL và thiết kế cơ sở dữ liệu','Cơ sở dữ liệu','Bài giảng','SQL, khóa chính, khóa ngoại, JOIN, chuẩn hóa và ERD.',['SQL','ERD'],67,4.9],
  ['Đề thi thử Mạng máy tính','Mạng máy tính','Đề thi','Bộ câu hỏi ôn tập TCP/IP, OSI và subnetting.',['Mạng máy tính'],31,4.5],
  ['Toán rời rạc – Ghi chú ôn tập','Toán','Ghi chú','Tóm tắt logic mệnh đề, tập hợp, quan hệ và đồ thị.',['Toán'],23,4.6],
  ['Python cho người mới bắt đầu','Lập trình','Bài giảng','Cú pháp Python, list, dict, function và bài tập thực hành.',['Python','Lập trình'],55,4.7]
 ];
 const docIds=[];
 for(let i=0;i<docs.length;i++){
  const [title,subject,type,description,tags,downloads,rating]=docs[i];
  const [[s]]=await db.query('SELECT subject_id FROM subjects WHERE name=?',[subject]);
  const slug='demo-'+(i+1)+'-'+Date.now();
  const fileName=`demo-${i+1}.pdf`;
  await db.query(`INSERT INTO documents(uploader_id,approved_by,category_id,subject_id,title,slug,description,file_path,original_filename,file_type,document_type,file_size,status,download_count,rating_avg,rating_count,approved_at)
   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())
   ON DUPLICATE KEY UPDATE title=VALUES(title)`,[ids['an@tailieusv.local'],ids['admin@tailieusv.local'],type==='Giáo trình'?1:type==='Bài giảng'?2:type==='Đề thi'?3:4,s.subject_id,title,slug,description,'uploads/'+fileName,fileName,'pdf',type,1024*150,'approved',downloads,rating,3]);
  const [[d]]=await db.query('SELECT doc_id FROM documents WHERE title=? ORDER BY doc_id DESC LIMIT 1',[title]); docIds.push(d.doc_id);
  for(const tag of tags){
   const tagSlug=tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
   await db.query('INSERT INTO tags(name,slug) VALUES(?,?) ON DUPLICATE KEY UPDATE tag_id=LAST_INSERT_ID(tag_id)',[tag,tagSlug]);
   const [[t]]=await db.query('SELECT tag_id FROM tags WHERE name=?',[tag]);
   await db.query('INSERT IGNORE INTO document_tags(doc_id,tag_id) VALUES(?,?)',[d.doc_id,t.tag_id]);
  }
 }
 // ratings/comments/favorites/downloads/reports/notifications
 const demoUsers=[ids['an@tailieusv.local'],ids['duc@tailieusv.local'],ids['nam@tailieusv.local']];
 const ratingSets=[[5,5,4],[5,4,5],[4,5,4],[5,4,5],[5,5,4]];
 for(let i=0;i<docIds.length;i++){
  await db.query('DELETE FROM ratings WHERE doc_id=?',[docIds[i]]);
  for(let j=0;j<3;j++) await db.query('INSERT INTO ratings(doc_id,user_id,score) VALUES(?,?,?)',[docIds[i],demoUsers[j],ratingSets[i][j]]);
  const [[avg]]=await db.query('SELECT ROUND(AVG(score),2) a,COUNT(*) c FROM ratings WHERE doc_id=?',[docIds[i]]);
  await db.query('UPDATE documents SET rating_avg=?,rating_count=? WHERE doc_id=?',[avg.a,avg.c,docIds[i]]);
 }
 await db.query('DELETE FROM comments WHERE doc_id IN (?)',[docIds]);
 const comments=[
  ['Tài liệu rất dễ hiểu, mình dùng để ôn bài rất ổn.',demoUsers[0]],['Phần ví dụ SQL khá rõ. Có thể bổ sung thêm JOIN nâng cao không?',demoUsers[1]],['Mình đã tải về và thấy nội dung đầy đủ.',demoUsers[2]]
 ];
 for(let i=0;i<docIds.length;i++) for(let j=0;j<3;j++) await db.query('INSERT INTO comments(doc_id,user_id,content) VALUES(?,?,?)',[docIds[i],comments[j][1],comments[j][0]]);
 await db.query('DELETE FROM favorites WHERE user_id IN (?,?,?)',[...demoUsers]);
 for(const [u,d] of [[demoUsers[0],docIds[0]],[demoUsers[0],docIds[1]],[demoUsers[1],docIds[2]],[demoUsers[2],docIds[4]]]) await db.query('INSERT IGNORE INTO favorites(user_id,doc_id) VALUES(?,?)',[u,d]);
 await db.query('DELETE FROM notifications WHERE user_id IN (?,?,?)',[...demoUsers]);
 for(const u of demoUsers) await db.query('INSERT INTO notifications(user_id,type,content) VALUES(?,?,?)',[u,'document','Tài liệu mới đã được duyệt và sẵn sàng để bạn học tập.']);
 // one open report for admin demo
 await db.query('DELETE FROM reports WHERE doc_id=?',[docIds[2]]);
 await db.query('INSERT INTO reports(doc_id,user_id,reason,detail) VALUES(?,?,?,?)',[docIds[2],demoUsers[1],'Kiểm tra nội dung','Báo cáo mẫu để quản trị viên thử xử lý.']);
 // Ensure demo files exist (simple PDF-like placeholder files are generated by a separate step if absent).
 const uploadDir=path.join(__dirname,'..','uploads'); fs.mkdirSync(uploadDir,{recursive:true});
 for(let i=0;i<docs.length;i++){const p=path.join(uploadDir,`demo-${i+1}.pdf`); if(!fs.existsSync(p)) fs.writeFileSync(p,`Demo document ${i+1} for TàiLiệuSV\n`);}
 await db.end();
 console.log('✅ Đã tạo dữ liệu demo: người dùng, tài liệu, đánh giá, bình luận, yêu thích, lượt tải, báo cáo và thông báo.');
 console.log('🔐 Tài khoản demo:');
 console.log('   admin@tailieusv.local / 123456');
 console.log('   an@tailieusv.local / 123456');
 console.log('   duc@tailieusv.local / 123456');
 console.log('   nam@tailieusv.local / 123456');
}
main().catch(e=>{console.error(e);process.exit(1)});
