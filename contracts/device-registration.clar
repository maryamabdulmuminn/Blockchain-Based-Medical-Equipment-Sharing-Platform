;; Device Registration Contract
;; Records details of expensive medical equipment

(define-data-var last-device-id uint u0)

;; Device status: 0 = inactive, 1 = active, 2 = maintenance
(define-map devices
  { device-id: uint }
  {
    name: (string-utf8 100),
    model: (string-utf8 100),
    manufacturer: (string-utf8 100),
    owner: principal,
    acquisition-date: uint,
    status: uint,
    last-maintenance: uint
  }
)

;; Register a new device
(define-public (register-device
    (name (string-utf8 100))
    (model (string-utf8 100))
    (manufacturer (string-utf8 100))
    (acquisition-date uint))
  (let ((new-id (+ (var-get last-device-id) u1)))
    (var-set last-device-id new-id)
    (map-set devices
      { device-id: new-id }
      {
        name: name,
        model: model,
        manufacturer: manufacturer,
        owner: tx-sender,
        acquisition-date: acquisition-date,
        status: u1,  ;; Set to active by default
        last-maintenance: u0
      }
    )
    (ok new-id)
  )
)

;; Update device status
(define-public (update-device-status (device-id uint) (new-status uint))
  (let ((device (map-get? devices { device-id: device-id })))
    (asserts! (is-some device) (err u1))
    (asserts! (is-eq tx-sender (get owner (unwrap-panic device))) (err u2))
    (asserts! (or (is-eq new-status u0) (is-eq new-status u1) (is-eq new-status u2)) (err u3))

    (map-set devices
      { device-id: device-id }
      (merge (unwrap-panic device) { status: new-status })
    )
    (ok true)
  )
)

;; Record device maintenance
(define-public (record-maintenance (device-id uint))
  (let ((device (map-get? devices { device-id: device-id })))
    (asserts! (is-some device) (err u1))
    (asserts! (is-eq tx-sender (get owner (unwrap-panic device))) (err u2))

    (map-set devices
      { device-id: device-id }
      (merge (unwrap-panic device)
        {
          status: u1,  ;; Set to active
          last-maintenance: block-height
        }
      )
    )
    (ok true)
  )
)

;; Get device details
(define-read-only (get-device (device-id uint))
  (map-get? devices { device-id: device-id })
)
