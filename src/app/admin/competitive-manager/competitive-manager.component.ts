import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatPaginator } from '@angular/material';
import { UserService } from '../../services';
import { QuestionDialogComponent } from '../../question-dialog/question-dialog.component';
import { EditCompetitiveDialogComponent } from './edit-competitive-dialog/edit-competitive-dialog.component';
import { Sort } from '@angular/material';
@Component({
  selector: 'app-competitive-manager',
  templateUrl: './competitive-manager.component.html',
  styleUrls: ['./competitive-manager.component.scss']
})
export class CompetitiveManagerComponent implements OnInit {
  displayedColumns = ['position', 'name', 'studentId', 'birthDate', 'interviewScore', 'avgScore', 'phone', 'online', 'action'];
  dataSource;
  count = 0;
  updateRef;
  data = {
    total: 10,
    docs: []
  };
  sortedData = {
    total: 10,
    docs: []
  };
  pageEvent: PageEvent;
  pageIndex;
  currentPage = 1;
  currentLimit = 10;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  constructor(private user: UserService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.SetData(1, 10);
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
    if (this.data.docs.indexOf(element) % 2 === 0) {
      return 'rgba(0,0,0,.001)';
    } else {
      return 'rgba(0,0,0,.03)';
    }
  }
  getAvgScore(playId) {
    return (playId.totalScore + playId.interviewScore) / 2;
  }
  // END STYLE FUNCTION

  SetData(page, limit) {
    this.user.GetUsers(page, limit, undefined).then(result => {
      this.data = result.data;
      console.log(this.data);
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
      this.dataSource.paginator = this.paginator;
    });
  }
  GetIndexPage(event) {
    this.user.GetUsers(event.pageIndex + 1, event.pageSize, undefined).then(result => {
      this.currentPage = event.pageIndex + 1;
      this.currentLimit = event.pageSize;
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
    });
  }
  openDialog(title: string, content: string, studentId: string, callback: Function) {
    let dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '250px',
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
                this.SetData(this.currentPage, this.currentLimit);
              } else {
                this.openSnackBar(resultDelete.message, 'Đóng');
              }
            })
            .catch(err => console.log(err));
        }
      });
    }
    if (comand == 'lock') {
      console.log(comand);
      this.openDialog('Thông báo', 'Bạn có muốn thay đổi trạng thái người dùng ' + studentId, studentId, result => {
        if (result == true) {
          this.user
            .LockUser(studentId)
            .then(reSultLock => {
              if (reSultLock.code == 1) {
                this.SetData(this.currentPage, this.currentLimit);
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
  CheckEx(play) {
    if (play.status == 1) {
      return 'Đang thi';
    } else {
      return 'Đã thi';
    }
  }
  Update(studentId: string) {
    this.user
      .GetUserById(studentId)
      .then(data => {
        if (data.code == 1) {
          this.updateRef = this.dialog.open(EditCompetitiveDialogComponent, {
            disableClose: true,
            width: '500px',
            data: data.user
          });
          this.updateRef.afterClosed().subscribe(result => {
            this.user.Update(result).then(re => {
              this.SetData(this.currentPage, this.currentLimit);
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
  Filter(bol: boolean) {
    console.log(bol);
    this.user.GetUsers(this.currentPage, this.currentLimit, bol).then(result => {
      console.log(result);
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortData(sort: Sort) {
    const data = this.data.docs.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData.docs = data;
      this.dataSource = new MatTableDataSource<Object>(this.sortedData.docs);
      return;
    } else {
      this.sortedData.docs = data.sort((a, b) => {
        // console.log(a, b);
        const isAsc = sort.direction === 'asc';
        if (!a.playId && b.playId) {
          return -1 * (isAsc ? 1 : -1);
        }
        if (a.playId && !b.playId) {
          return 1 * (isAsc ? 1 : -1);
        }
        if (!a.playId && !b.playId) {
          return -1 * (isAsc ? 1 : -1);
        }
        if (a.playId && b.playId) {
          switch (sort.active) {
            case 'testScore':
              return this.compare(a.playId.totalScore, b.playId.totalScore, isAsc);
            case 'interviewScore':
              return this.compare(a.playId.interviewScore, b.playId.interviewScore, isAsc);
            case 'avgScore': {
              const avgA = (a.playId.totalScore + a.playId.interviewScore) / 2;
              const avgB = (b.playId.totalScore + b.playId.interviewScore) / 2;
              return this.compare(avgA, avgB, isAsc);
            }
            case 'status':
              return this.compare(a.playId.status, b.status, isAsc);
            default:
              return 0;
          }
        }
      });
      // console.log(this.sortedData.docs);
      this.dataSource = new MatTableDataSource<Object>(this.sortedData.docs);
    }
  }
}
