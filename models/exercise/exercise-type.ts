export interface ExerciseTypeDto {
    id: number;
    code: string;
    desc: string;
    icon: string;
    color: string;
}

export interface ExerciseTypePayload {
    code: string;
    desc: string;
    icon: string;
    color: string;
}