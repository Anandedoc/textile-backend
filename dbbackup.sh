# cd /var/lib/mysql 
# mkdir dbbackup
# cp -rf fortunetextiles dbbackup/
# cp ibdata1 dbbackup/
# tar -czvf my_backup.tar.gz dbbackup/
# aws s3 cp my_backup.tar.gz s3://fortuneofdev/textiles/dbbackup
# rm -rf dbbackup
# rm my_backup.tar.gz

cd /var/lib/mysql 
DB_USER="admin"
DB_PASS="AaBb123456!@#"
DB_NAME="fortunetextiles"
BACKUP_FILE="backup_file.sql"
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://fortuneofdev/textiles/dbbackup/
rm $BACKUP_FILE