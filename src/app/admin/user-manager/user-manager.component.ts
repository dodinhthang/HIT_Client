import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from '../../services';
import { QuestionDialogComponent } from '../../question-dialog/question-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
  displayedColumns = ['position', 'name', 'studentId', 'birthDate', 'phone', 'online', 'action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource;
  count = 0;
  updateRef;
  data = [];
  constructor(private user: UserService, public dialog: MatDialog, public snackBar: MatSnackBar) {}
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  ngOnInit() {
    this.SetData();
  }
  // STYLE FUNCTION
  checkLock(element) {
    if (element.isLocked === true) {
      return '#ee4035';
    } else {
      return '#1e1f26';
    }
  }
  getRowStyle(element) {
    if (this.data.indexOf(element) % 2 === 0) {
      // return 'white';
      return 'rgba(0,0,0,.001)';
    } else {
      return 'rgba(0,0,0,.03)';
    }
  }
  // END STYLE FUNCTION
  SetData() {
    this.user.GetAdmins().then(result => {
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(title: string, content: string, studentId: string, callback: Function) {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '250px',
      height: '',
      data: { name: title, content: content }
    });

    dialogRef.afterClosed().subscribe(result => {
      return callback(result);
    });
  }
  Open(studentId: string, comand: string) {
    if (comand == 'delete') {
      this.openDialog('Thông báo', 'Bạn có muốn xóa người dùng ' + studentId, studentId, result => {
        if (result == true) {
          this.user
            .DeleteUser(studentId)
            .then(resultDelete => {
              if (resultDelete.code == 1) {
                this.openSnackBar(resultDelete.message, 'Đóng');
                this.SetData();
              } else {
                this.openSnackBar(resultDelete.message, 'Đóng');
              }
            })
            .catch(err => console.log(err));
        }
      });
    }
    if (comand == 'lock') {
      this.openDialog('Thông báo', 'Bạn có muốn thay đổi trạng thái người dùng ' + studentId, studentId, result => {
        if (result == true) {
          this.user
            .LockUser(studentId)
            .then(reSultLock => {
              if (reSultLock.code == 1) {
                this.SetData();
                this.openSnackBar(reSultLock.message, 'Đóng');
              } else {
                this.openSnackBar(reSultLock.message, 'Đóng');
              }
            })
            .catch(err => {
              this.openSnackBar('Không tìm thấy người dùng', 'Đóng');
            });
        }
      });
    }
  }
  Update(studentId: string) {
    this.user
      .GetUserById(studentId)
      .then(data => {
        if (data.code == 1) {
          this.updateRef = this.dialog.open(EditUserDialogComponent, {
            width: '500px',
            height: 'auto',
            data: data.user
          });
          this.updateRef.afterClosed().subscribe(result => {
            this.user.Update(result).then(re => {
              this.SetData();
              this.openSnackBar('Cập nhập người dùng thành công ', 'Đóng');
            });
          });
        } else {
          this.openSnackBar('Bạn không có quyền ', 'Đóng');
        }
      })
      .catch(err => {
        this.openSnackBar('Không tìm thấy người dùng', 'Đóng');
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
