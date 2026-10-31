import styled from "styled-components";

export const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  gap: 20px;
`;

export const AdminPanel = styled.div`
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  h3 {
    color: #f1c40f;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;

  input,
  select {
    flex: 1;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #34495e;
    background: rgba(0, 0, 0, 0.3);
    color: #ecf0f1;
    min-width: 150px;
  }
`;

export const BulkArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #34495e;
  background: rgba(0, 0, 0, 0.3);
  color: #ecf0f1;
  font-family: monospace;
  margin-bottom: 15px;
  resize: vertical;
`;

export const WordTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 0.9rem;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  th {
    color: #3498db;
  }

  .del-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
`;
