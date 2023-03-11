export const convertToMedicationNames = (medicationIds, medicationsData) => {
  const medications = medicationIds?.map((medItem) => {
    return medicationsData?.filter((med) => med?.id == medItem)[0];
  });

  return medications?.map((med) => med?.product_name)?.join(', ');
};

export const convertToDiagnosisNames = (diagnosisIds, diagnosisData) => {
  const diagnosis = diagnosisIds?.map((diaItem) => {
    return diagnosisData?.filter((diag) => diag?.id == diaItem)[0];
  });

  return diagnosis?.map((dia) => dia?.name)?.join(', ');
};

export const convertToTreatmentNames = (treatmentId, treatmentsData) => {
  return treatmentsData?.filter((trt) => trt?.id == treatmentId)[0]?.name;
};
