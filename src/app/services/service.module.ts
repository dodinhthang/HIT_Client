import { NgModule } from '@angular/core';
import {AuthService} from './auth.service';
import { UserService } from './user.service';
import { PlayService } from './play.service';
import { QuestionService } from './quesion.service';
import { QuestionListService } from './question-list.service';
@NgModule({
    declarations: [],
    imports: [ ],
    exports: [],
    providers: [AuthService,UserService,PlayService,QuestionService,QuestionListService],
})
export class APIModule {}
