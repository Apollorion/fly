export enum FlightType {
    LOGICAL = "LOGICAL",
    STANDARD = "STANDARD"
}

export interface Flight {
    type: FlightType,
    identifier: string,
    values?: string[],
    override?: string,
}

export interface LogicalFlightDefinition {
    [key: string]: {
        logic: string,
        override?: string
    }
}

export interface StandardFlightDefinition {
    [key: string]: string[]
}