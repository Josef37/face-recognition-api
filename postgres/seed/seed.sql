BEGIN TRANSACTION;

INSERT INTO users (
  name, email, entries, joined
) VALUES 
  ('Tim', 'tim@gmail.com', 5, '2019-10-29'),
  ('Tom', 'tom@gmail.com', 100, '2018-05-01');

INSERT INTO login (
  hash, email
) VALUES 
  ('$2a$10$N/0Ij7YmXuOWA.wBnEH0kOV3T/4V624CMspQxW9hGkuGfkG9FYCe6', 'tim@gmail.com'),
  ('$2a$10$S4oGMRcxubbeZ14QLBHFFeSv9jHF24UPV4whxUef9DzEVUzeF60lS', 'tom@gmail.com');

COMMIT;