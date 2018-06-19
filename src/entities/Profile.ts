import { IsString, IsNumber, MaxLength, MinLength, IsIn, IsDate, ValidateIf } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { IsUnique } from "../lib/validations";
import { User } from "./User";
import { ProfilePics } from "./ProfilePics";
import { BaseEntity } from "./BaseEntity";
import moment from "moment";


@Entity()
export class Profile extends BaseEntity {

  fillable = ["pseudo", "gender", "forGender", "city", "birthDate", "headline", "content", "user"];
  hidden = ["user"];

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ValidateIf(o => o.pseudo)
  @MinLength(3)
  @IsUnique()
  pseudo: string;

  @Column()
  @IsIn(["M", "F"])
  gender: string;

  @Column()
  @IsIn(["M", "F"])
  forGender: string;

  @Column()
  @ValidateIf(o => o.city)
  @IsString()
  city: string;

  @Column()
  @IsDate()
  birthDate: Date;

  @Column()
  @ValidateIf(o => o.headline)
  @IsString()
  @MaxLength(255)
  headline: string;

  @Column()
  @ValidateIf(o => o.content)
  @IsString()
  @MaxLength(2000)
  content: string;

  // photos

  @OneToOne(type => User, user => user.profile)
  @JoinColumn()
  user: User;

  @OneToMany(type => ProfilePics, profilePics => profilePics.profile)
  pics: ProfilePics[];

  setBirthDate(birthDate) {
    this.birthDate = moment(birthDate, "YYYY-MM-DD").toDate();
  }
}
