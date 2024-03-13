interface JetComparisonResult {
    name: string;
    value: string;
}

interface JetComparisons {
    results: JetComparisonResult[];
}


type Criteria = "topSpeed" | "maxSeating" | "fuelEfficiency"
