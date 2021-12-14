(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (type (;1;) (func (param i32 i32)))
  (type (;2;) (func (param i32 i32 i32) (result i32)))
  (type (;3;) (func (param i32)))
  (type (;4;) (func (param i32 i32 i32)))
  (type (;5;) (func (param i32 i32 i32 i32)))
  (type (;6;) (func))
  (type (;7;) (func (param i32 i32 i32 i32 i32)))
  (type (;8;) (func (param i32) (result i32)))
  (type (;9;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;10;) (func (result i32)))
  (type (;11;) (func (param i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;12;) (func (param i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;13;) (func (param i64 i32 i32) (result i32)))
  (type (;14;) (func (param i32) (result i64)))
  (import "w3" "__w3_invoke_args" (func (;0;) (type 1)))
  (import "w3" "__w3_invoke_error" (func (;1;) (type 1)))
  (import "w3" "__w3_invoke_result" (func (;2;) (type 1)))
  (func (;3;) (type 3) (param i32)
    local.get 0
    call 4)
  (func (;4;) (type 3) (param i32)
    (local i32)
    block  ;; label = @1
      local.get 0
      i32.load
      i32.const 0
      local.get 0
      i32.load offset=4
      local.tee 0
      select
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      call 24
    end)
  (func (;5;) (type 3) (param i32)
    local.get 0
    call 4
    local.get 0
    i32.const 12
    i32.add
    local.tee 0
    call 6
    local.get 0
    call 7)
  (func (;6;) (type 3) (param i32)
    (local i32)
    local.get 0
    i32.load offset=8
    i32.const 36
    i32.mul
    local.set 1
    local.get 0
    i32.load
    local.set 0
    loop  ;; label = @1
      local.get 1
      if  ;; label = @2
        local.get 0
        call 4
        local.get 0
        i32.const 12
        i32.add
        call 4
        local.get 0
        i32.const 24
        i32.add
        call 4
        local.get 1
        i32.const 36
        i32.sub
        local.set 1
        local.get 0
        i32.const 36
        i32.add
        local.set 0
        br 1 (;@1;)
      end
    end)
  (func (;7;) (type 3) (param i32)
    (local i32)
    block  ;; label = @1
      local.get 0
      i32.load
      i32.const 0
      local.get 0
      i32.load offset=4
      local.tee 0
      select
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 36
      i32.mul
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      call 24
    end)
  (func (;8;) (type 3) (param i32)
    local.get 0
    call 5
    local.get 0
    i32.const 24
    i32.add
    local.tee 0
    i32.const 4
    i32.add
    call 4
    local.get 0
    i32.const 24
    i32.add
    call 5)
  (func (;9;) (type 0) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.const 1048700
    i32.const 3
    call 10)
  (func (;10;) (type 9) (param i32 i32 i32 i32) (result i32)
    (local i32 i32)
    local.get 1
    local.get 3
    i32.eq
    if (result i32)  ;; label = @1
      i32.const 0
      local.set 3
      block  ;; label = @2
        local.get 1
        i32.eqz
        br_if 0 (;@2;)
        loop  ;; label = @3
          local.get 0
          i32.load8_u
          local.tee 4
          local.get 2
          i32.load8_u
          local.tee 5
          i32.eq
          if  ;; label = @4
            local.get 0
            i32.const 1
            i32.add
            local.set 0
            local.get 2
            i32.const 1
            i32.add
            local.set 2
            local.get 1
            i32.const 1
            i32.sub
            local.tee 1
            br_if 1 (;@3;)
            br 2 (;@2;)
          end
        end
        local.get 4
        local.get 5
        i32.sub
        local.set 3
      end
      local.get 3
      i32.eqz
    else
      i32.const 0
    end)
  (func (;11;) (type 4) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    local.get 1
    i32.load
    i32.const 1
    i32.ne
    if  ;; label = @1
      local.get 0
      local.get 1
      i64.load offset=4 align=4
      i64.store align=4
      local.get 0
      i32.const 8
      i32.add
      local.get 1
      i32.const 12
      i32.add
      i32.load
      i32.store
      local.get 3
      i32.const 16
      i32.add
      global.set 0
      return
    end
    local.get 3
    i32.const 8
    i32.add
    local.get 1
    i32.const 12
    i32.add
    i32.load
    i32.store
    local.get 3
    local.get 1
    i64.load offset=4 align=4
    i64.store
    i32.const 1052840
    i32.const 43
    local.get 3
    i32.const 1048576
    local.get 2
    call 12
    unreachable)
  (func (;12;) (type 7) (param i32 i32 i32 i32 i32)
    (local i32)
    global.get 0
    i32.const -64
    i32.add
    local.tee 5
    global.set 0
    local.get 5
    local.get 1
    i32.store offset=12
    local.get 5
    local.get 0
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=20
    local.get 5
    local.get 2
    i32.store offset=16
    local.get 5
    i32.const 44
    i32.add
    i32.const 2
    i32.store
    local.get 5
    i32.const 60
    i32.add
    i32.const 1
    i32.store
    local.get 5
    i64.const 2
    i64.store offset=28 align=4
    local.get 5
    i32.const 1049452
    i32.store offset=24
    local.get 5
    i32.const 2
    i32.store offset=52
    local.get 5
    local.get 5
    i32.const 48
    i32.add
    i32.store offset=40
    local.get 5
    local.get 5
    i32.const 16
    i32.add
    i32.store offset=56
    local.get 5
    local.get 5
    i32.const 8
    i32.add
    i32.store offset=48
    local.get 5
    i32.const 24
    i32.add
    local.get 4
    call 40
    unreachable)
  (func (;13;) (type 0) (param i32 i32) (result i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    local.get 0
    i32.load
    i32.const 1
    i32.ne
    if  ;; label = @1
      local.get 0
      i32.load offset=4
      local.set 0
      local.get 2
      i32.const 16
      i32.add
      global.set 0
      local.get 0
      return
    end
    local.get 2
    i32.const 8
    i32.add
    local.get 0
    i32.const 12
    i32.add
    i32.load
    i32.store
    local.get 2
    local.get 0
    i64.load offset=4 align=4
    i64.store
    i32.const 1052840
    i32.const 43
    local.get 2
    i32.const 1048576
    local.get 1
    call 12
    unreachable)
  (func (;14;) (type 0) (param i32 i32) (result i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    local.get 0
    i32.load8_u
    i32.const 1
    i32.ne
    if  ;; label = @1
      local.get 0
      i32.load8_u offset=1
      local.set 0
      local.get 2
      i32.const 16
      i32.add
      global.set 0
      local.get 0
      return
    end
    local.get 2
    i32.const 8
    i32.add
    local.get 0
    i32.const 12
    i32.add
    i32.load
    i32.store
    local.get 2
    local.get 0
    i32.const 4
    i32.add
    i64.load align=4
    i64.store
    i32.const 1052840
    i32.const 43
    local.get 2
    i32.const 1048576
    local.get 1
    call 12
    unreachable)
  (func (;15;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 12
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 15
      i32.load
      local.set 0
      local.get 15
      i32.load offset=4
      local.set 1
      local.get 15
      i32.load offset=8
      local.set 15
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 2
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load
        local.set 15
        local.get 0
        i32.load offset=8
        local.set 0
      end
      local.get 2
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        block (result i32)  ;; label = @3
          local.get 15
          local.set 6
          local.get 0
          local.set 8
          local.get 1
          local.set 2
          global.get 3
          i32.const 2
          i32.eq
          if  ;; label = @4
            global.get 4
            global.get 4
            i32.load
            i32.const 68
            i32.sub
            i32.store
            global.get 4
            i32.load
            local.tee 3
            i32.load
            local.set 6
            local.get 3
            i32.load offset=12
            local.set 4
            local.get 3
            i32.load offset=16
            local.set 5
            local.get 3
            i64.load offset=20 align=4
            local.set 7
            local.get 3
            i32.load offset=28
            local.set 9
            local.get 3
            i32.load offset=32
            local.set 10
            local.get 3
            i32.load offset=36
            local.set 12
            local.get 3
            i32.load offset=40
            local.set 11
            local.get 3
            i32.load offset=44
            local.set 13
            local.get 3
            i32.load offset=48
            local.set 14
            local.get 3
            i32.load offset=52
            local.set 17
            local.get 3
            i32.load offset=56
            local.set 18
            local.get 3
            i32.load offset=60
            local.set 19
            local.get 3
            i32.load offset=64
            local.set 20
            local.get 3
            i32.load offset=4
            local.set 8
            local.get 3
            i32.load offset=8
            local.set 2
          end
          block (result i32)  ;; label = @4
            global.get 3
            i32.const 2
            i32.eq
            if  ;; label = @5
              global.get 4
              global.get 4
              i32.load
              i32.const 4
              i32.sub
              i32.store
              global.get 4
              i32.load
              i32.load
              local.set 16
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 2
              i32.load offset=24
              local.set 14
              i32.const 1
              local.set 12
              local.get 2
              i32.const 28
              i32.add
              local.tee 2
              i32.load
              local.tee 18
              i32.load offset=16
              local.set 17
            end
            local.get 16
            i32.eqz
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 14
              i32.const 34
              local.get 17
              call_indirect (type 0)
              local.set 3
              i32.const 0
              global.get 3
              i32.const 1
              i32.eq
              br_if 1 (;@4;)
              drop
              local.get 3
              local.set 2
            end
            block  ;; label = @5
              block  ;; label = @6
                global.get 3
                i32.eqz
                i32.const 0
                local.get 2
                select
                br_if 0 (;@6;)
                block  ;; label = @7
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    local.get 8
                    i32.eqz
                    if  ;; label = @9
                      i32.const 0
                      local.set 2
                      br 2 (;@7;)
                    end
                    local.get 6
                    local.get 8
                    i32.add
                    local.set 19
                    local.get 6
                    local.set 9
                    i32.const 0
                    local.set 11
                    i32.const 0
                    local.set 4
                  end
                  block  ;; label = @8
                    loop  ;; label = @9
                      global.get 3
                      i32.eqz
                      if  ;; label = @10
                        local.get 9
                        local.set 20
                        block (result i32)  ;; label = @11
                          local.get 9
                          i32.load8_s
                          local.tee 2
                          i32.const -1
                          i32.gt_s
                          if  ;; label = @12
                            local.get 2
                            i32.const 255
                            i32.and
                            local.set 5
                            local.get 9
                            i32.const 1
                            i32.add
                            br 1 (;@11;)
                          end
                          local.get 9
                          i32.load8_u offset=1
                          i32.const 63
                          i32.and
                          local.set 10
                          local.get 2
                          i32.const 31
                          i32.and
                          local.set 12
                          local.get 2
                          i32.const 255
                          i32.and
                          local.tee 2
                          i32.const 223
                          i32.le_u
                          if  ;; label = @12
                            local.get 10
                            local.get 12
                            i32.const 6
                            i32.shl
                            i32.or
                            local.set 5
                            local.get 9
                            i32.const 2
                            i32.add
                            br 1 (;@11;)
                          end
                          local.get 9
                          i32.load8_u offset=2
                          i32.const 63
                          i32.and
                          local.get 10
                          i32.const 6
                          i32.shl
                          i32.or
                          local.set 10
                          local.get 2
                          i32.const 240
                          i32.lt_u
                          if  ;; label = @12
                            local.get 10
                            local.get 12
                            i32.const 12
                            i32.shl
                            i32.or
                            local.set 5
                            local.get 9
                            i32.const 3
                            i32.add
                            br 1 (;@11;)
                          end
                          local.get 12
                          i32.const 18
                          i32.shl
                          i32.const 1835008
                          i32.and
                          local.get 9
                          i32.load8_u offset=3
                          i32.const 63
                          i32.and
                          local.get 10
                          i32.const 6
                          i32.shl
                          i32.or
                          i32.or
                          local.tee 5
                          i32.const 1114112
                          i32.eq
                          local.tee 2
                          br_if 3 (;@8;)
                          local.get 9
                          i32.const 4
                          i32.add
                        end
                        local.set 9
                        i32.const 116
                        local.set 13
                        local.get 5
                        i32.const 9
                        i32.sub
                        local.set 10
                        i32.const 2
                        local.set 2
                      end
                      block  ;; label = @10
                        block  ;; label = @11
                          global.get 3
                          i32.eqz
                          if  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          block  ;; label = @20
                                            block  ;; label = @21
                                              local.get 10
                                              br_table 8 (;@13;) 3 (;@18;) 1 (;@20;) 1 (;@20;) 2 (;@19;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 1 (;@20;) 4 (;@17;) 0 (;@21;)
                                            end
                                            local.get 5
                                            i32.const 92
                                            i32.eq
                                            local.tee 13
                                            br_if 3 (;@17;)
                                          end
                                          local.get 5
                                          call 53
                                          br_if 5 (;@14;)
                                          local.get 5
                                          i32.const 65536
                                          i32.lt_u
                                          br_if 3 (;@16;)
                                          local.get 5
                                          i32.const 131072
                                          i32.ge_u
                                          br_if 4 (;@15;)
                                          local.get 5
                                          i32.const 1051035
                                          i32.const 42
                                          i32.const 1051119
                                          i32.const 192
                                          i32.const 1051311
                                          i32.const 438
                                          call 54
                                          i32.eqz
                                          local.tee 2
                                          br_if 5 (;@14;)
                                          br 8 (;@11;)
                                        end
                                        i32.const 114
                                        local.set 13
                                        br 5 (;@13;)
                                      end
                                      i32.const 110
                                      local.set 13
                                      br 4 (;@13;)
                                    end
                                    local.get 5
                                    local.set 13
                                    br 3 (;@13;)
                                  end
                                  local.get 5
                                  i32.const 1050364
                                  i32.const 40
                                  i32.const 1050444
                                  i32.const 288
                                  i32.const 1050732
                                  i32.const 303
                                  call 54
                                  i32.eqz
                                  local.tee 2
                                  br_if 1 (;@14;)
                                  br 4 (;@11;)
                                end
                                local.get 5
                                i32.const 2097120
                                i32.and
                                i32.const 173792
                                i32.eq
                                br_if 0 (;@14;)
                                local.get 5
                                i32.const 177977
                                i32.sub
                                i32.const 7
                                i32.lt_u
                                br_if 0 (;@14;)
                                local.get 5
                                i32.const 2097150
                                i32.and
                                i32.const 178206
                                i32.eq
                                br_if 0 (;@14;)
                                local.get 5
                                i32.const 183970
                                i32.sub
                                i32.const 14
                                i32.lt_u
                                br_if 0 (;@14;)
                                local.get 5
                                i32.const 191457
                                i32.sub
                                i32.const 3103
                                i32.lt_u
                                br_if 0 (;@14;)
                                local.get 5
                                i32.const 195102
                                i32.sub
                                i32.const 1506
                                i32.lt_u
                                br_if 0 (;@14;)
                                local.get 5
                                i32.const 201547
                                i32.sub
                                i32.const 716213
                                i32.lt_u
                                br_if 0 (;@14;)
                                local.get 5
                                i32.const 918000
                                i32.lt_u
                                local.tee 2
                                br_if 3 (;@11;)
                              end
                              local.get 5
                              i32.const 1
                              i32.or
                              i32.clz
                              i32.const 2
                              i32.shr_u
                              i32.const 7
                              i32.xor
                              i64.extend_i32_u
                              i64.const 21474836480
                              i64.or
                              local.set 7
                              i32.const 3
                              local.set 2
                              local.get 5
                              local.set 13
                            end
                            local.get 4
                            local.get 11
                            i32.gt_u
                            br_if 2 (;@10;)
                            block  ;; label = @13
                              local.get 4
                              i32.eqz
                              br_if 0 (;@13;)
                              local.get 4
                              local.get 8
                              i32.ge_u
                              if  ;; label = @14
                                local.get 4
                                local.get 8
                                i32.eq
                                br_if 1 (;@13;)
                                br 4 (;@10;)
                              end
                              local.get 4
                              local.get 6
                              i32.add
                              i32.load8_s
                              i32.const -64
                              i32.lt_s
                              br_if 3 (;@10;)
                            end
                            block  ;; label = @13
                              local.get 11
                              i32.eqz
                              br_if 0 (;@13;)
                              local.get 8
                              local.get 11
                              i32.le_u
                              if  ;; label = @14
                                local.get 8
                                local.get 11
                                i32.ne
                                br_if 4 (;@10;)
                                br 1 (;@13;)
                              end
                              local.get 6
                              local.get 11
                              i32.add
                              i32.load8_s
                              i32.const -65
                              i32.le_s
                              br_if 3 (;@10;)
                            end
                            local.get 4
                            local.get 6
                            i32.add
                            local.set 10
                            local.get 18
                            i32.load offset=12
                            local.set 12
                            local.get 11
                            local.get 4
                            i32.sub
                            local.set 4
                          end
                          local.get 16
                          i32.const 1
                          i32.eq
                          i32.const 1
                          global.get 3
                          select
                          if  ;; label = @12
                            local.get 14
                            local.get 10
                            local.get 4
                            local.get 12
                            call_indirect (type 2)
                            local.set 3
                            i32.const 1
                            global.get 3
                            i32.const 1
                            i32.eq
                            br_if 8 (;@4;)
                            drop
                            local.get 3
                            local.set 4
                          end
                          global.get 3
                          i32.eqz
                          if  ;; label = @12
                            i32.const 1
                            local.get 4
                            i32.eqz
                            local.tee 4
                            i32.eqz
                            br_if 9 (;@3;)
                            drop
                          end
                          loop  ;; label = @12
                            global.get 3
                            i32.eqz
                            if  ;; label = @13
                              local.get 2
                              local.set 10
                              i32.const 1
                              local.set 12
                              i32.const 92
                              local.set 4
                              i32.const 1
                              local.set 2
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          local.get 10
                                          i32.const 1
                                          i32.sub
                                          br_table 1 (;@18;) 5 (;@14;) 0 (;@19;) 2 (;@17;)
                                        end
                                        block  ;; label = @19
                                          block  ;; label = @20
                                            block  ;; label = @21
                                              block  ;; label = @22
                                                local.get 7
                                                i64.const 32
                                                i64.shr_u
                                                i32.wrap_i64
                                                i32.const 255
                                                i32.and
                                                i32.const 1
                                                i32.sub
                                                br_table 6 (;@16;) 3 (;@19;) 0 (;@22;) 1 (;@21;) 2 (;@20;) 5 (;@17;)
                                              end
                                              local.get 7
                                              i64.const -1095216660481
                                              i64.and
                                              i64.const 8589934592
                                              i64.or
                                              local.set 7
                                              i32.const 3
                                              local.set 2
                                              i32.const 123
                                              local.set 4
                                              br 7 (;@14;)
                                            end
                                            local.get 7
                                            i64.const -1095216660481
                                            i64.and
                                            i64.const 12884901888
                                            i64.or
                                            local.set 7
                                            i32.const 3
                                            local.set 2
                                            i32.const 117
                                            local.set 4
                                            br 6 (;@14;)
                                          end
                                          local.get 7
                                          i64.const -1095216660481
                                          i64.and
                                          i64.const 17179869184
                                          i64.or
                                          local.set 7
                                          i32.const 3
                                          local.set 2
                                          br 5 (;@14;)
                                        end
                                        i32.const 48
                                        i32.const 87
                                        local.get 13
                                        local.get 7
                                        i32.wrap_i64
                                        local.tee 2
                                        i32.const 2
                                        i32.shl
                                        i32.shr_u
                                        i32.const 15
                                        i32.and
                                        local.tee 4
                                        i32.const 10
                                        i32.lt_u
                                        select
                                        local.tee 10
                                        local.get 4
                                        i32.add
                                        local.set 4
                                        local.get 2
                                        i32.eqz
                                        br_if 3 (;@15;)
                                        local.get 7
                                        i64.const -4294967296
                                        i64.and
                                        local.get 7
                                        i64.const 1
                                        i64.sub
                                        i64.const 4294967295
                                        i64.and
                                        i64.or
                                        local.set 7
                                        i32.const 3
                                        local.set 2
                                        br 4 (;@14;)
                                      end
                                      i32.const 0
                                      local.set 2
                                      local.get 13
                                      local.set 4
                                      br 3 (;@14;)
                                    end
                                    local.get 11
                                    block (result i32)  ;; label = @17
                                      i32.const 1
                                      local.get 5
                                      i32.const 128
                                      i32.lt_u
                                      local.tee 13
                                      br_if 0 (;@17;)
                                      drop
                                      i32.const 2
                                      local.get 5
                                      i32.const 2048
                                      i32.lt_u
                                      local.tee 13
                                      br_if 0 (;@17;)
                                      drop
                                      i32.const 3
                                      i32.const 4
                                      local.get 5
                                      i32.const 65536
                                      i32.lt_u
                                      select
                                    end
                                    local.tee 2
                                    i32.add
                                    local.set 4
                                    br 5 (;@11;)
                                  end
                                  local.get 7
                                  i64.const -1095216660481
                                  i64.and
                                  local.set 7
                                  i32.const 3
                                  local.set 2
                                  i32.const 125
                                  local.set 4
                                  br 1 (;@14;)
                                end
                                local.get 7
                                i64.const -1095216660481
                                i64.and
                                i64.const 4294967296
                                i64.or
                                local.set 7
                                i32.const 3
                                local.set 2
                              end
                            end
                            local.get 16
                            i32.const 2
                            i32.eq
                            i32.const 1
                            global.get 3
                            select
                            if  ;; label = @13
                              local.get 14
                              local.get 4
                              local.get 17
                              call_indirect (type 0)
                              local.set 3
                              i32.const 2
                              global.get 3
                              i32.const 1
                              i32.eq
                              br_if 9 (;@4;)
                              drop
                              local.get 3
                              local.set 4
                            end
                            global.get 3
                            i32.eqz
                            if  ;; label = @13
                              local.get 4
                              i32.eqz
                              local.tee 4
                              br_if 1 (;@12;)
                            end
                          end
                          global.get 3
                          i32.eqz
                          br_if 5 (;@6;)
                        end
                        global.get 3
                        i32.eqz
                        if  ;; label = @11
                          local.get 9
                          local.get 11
                          local.get 20
                          i32.sub
                          i32.add
                          local.set 11
                          local.get 9
                          local.get 19
                          i32.ne
                          local.tee 2
                          br_if 2 (;@9;)
                          br 3 (;@8;)
                        end
                      end
                    end
                    global.get 3
                    i32.eqz
                    if  ;; label = @9
                      local.get 6
                      local.get 8
                      local.get 4
                      local.get 11
                      i32.const 1049744
                      call 50
                      unreachable
                    end
                  end
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    local.get 4
                    i32.eqz
                    if  ;; label = @9
                      i32.const 0
                      local.set 2
                      br 2 (;@7;)
                    end
                    local.get 4
                    local.get 8
                    i32.ge_u
                    if  ;; label = @9
                      local.get 4
                      local.get 8
                      local.tee 2
                      i32.eq
                      br_if 2 (;@7;)
                      br 4 (;@5;)
                    end
                    local.get 4
                    local.get 6
                    i32.add
                    i32.load8_s
                    i32.const -65
                    i32.le_s
                    br_if 3 (;@5;)
                    local.get 4
                    local.set 2
                  end
                end
                global.get 3
                i32.eqz
                if  ;; label = @7
                  i32.const 1
                  local.set 12
                  local.get 2
                  local.get 6
                  i32.add
                  local.set 6
                  local.get 8
                  local.get 2
                  i32.sub
                  local.set 8
                  local.get 18
                  i32.load offset=12
                  local.set 2
                end
                local.get 16
                i32.const 3
                i32.eq
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 14
                  local.get 6
                  local.get 8
                  local.get 2
                  call_indirect (type 2)
                  local.set 3
                  i32.const 3
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 3 (;@4;)
                  drop
                  local.get 3
                  local.set 6
                end
                global.get 3
                i32.eqz
                i32.const 0
                local.get 6
                select
                br_if 0 (;@6;)
                local.get 16
                i32.const 4
                i32.eq
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 14
                  i32.const 34
                  local.get 17
                  call_indirect (type 0)
                  local.set 3
                  i32.const 4
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 3 (;@4;)
                  drop
                  local.get 3
                  local.set 6
                end
                local.get 6
                global.get 3
                i32.eqz
                br_if 3 (;@3;)
                drop
              end
              local.get 12
              global.get 3
              i32.eqz
              br_if 2 (;@3;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 6
              local.get 8
              local.get 4
              local.get 8
              i32.const 1049760
              call 50
              unreachable
            end
            unreachable
          end
          local.set 3
          global.get 4
          i32.load
          local.get 3
          i32.store
          global.get 4
          global.get 4
          i32.load
          i32.const 4
          i32.add
          i32.store
          global.get 4
          i32.load
          local.tee 3
          local.get 6
          i32.store
          local.get 3
          local.get 8
          i32.store offset=4
          local.get 3
          local.get 2
          i32.store offset=8
          local.get 3
          local.get 4
          i32.store offset=12
          local.get 3
          local.get 5
          i32.store offset=16
          local.get 3
          local.get 7
          i64.store offset=20 align=4
          local.get 3
          local.get 9
          i32.store offset=28
          local.get 3
          local.get 10
          i32.store offset=32
          local.get 3
          local.get 12
          i32.store offset=36
          local.get 3
          local.get 11
          i32.store offset=40
          local.get 3
          local.get 13
          i32.store offset=44
          local.get 3
          local.get 14
          i32.store offset=48
          local.get 3
          local.get 17
          i32.store offset=52
          local.get 3
          local.get 18
          i32.store offset=56
          local.get 3
          local.get 19
          i32.store offset=60
          local.get 3
          local.get 20
          i32.store offset=64
          global.get 4
          global.get 4
          i32.load
          i32.const 68
          i32.add
          i32.store
          i32.const 0
        end
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 15
    i32.store offset=8
    global.get 4
    global.get 4
    i32.load
    i32.const 12
    i32.add
    i32.store
    i32.const 0)
  (func (;16;) (type 1) (param i32 i32)
    (local i32 i32 i32 i64)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 16
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i32.load offset=4
      local.set 1
      local.get 2
      i32.load offset=8
      local.set 4
      local.get 2
      i32.load offset=12
      local.set 2
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 3
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 16
        i32.sub
        local.tee 4
        global.set 0
        local.get 4
        i32.const 8
        i32.add
        local.set 2
      end
      local.get 3
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 2
        local.get 1
        call 17
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i64.load offset=8
        local.set 5
        local.get 0
        i32.const 0
        i32.store offset=8
        local.get 0
        local.get 5
        i64.store align=4
        local.get 4
        i32.const 16
        i32.add
        global.set 0
      end
      return
    end
    local.set 3
    global.get 4
    i32.load
    local.get 3
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 3
    local.get 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 4
    i32.store offset=8
    local.get 3
    local.get 2
    i32.store offset=12
    global.get 4
    global.get 4
    i32.load
    i32.const 16
    i32.add
    i32.store)
  (func (;17;) (type 1) (param i32 i32)
    (local i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 16
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i32.load offset=4
      local.set 1
      local.get 2
      i32.load offset=8
      local.set 3
      local.get 2
      i32.load offset=12
      local.set 2
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 4
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 16
        i32.sub
        local.tee 3
        global.set 0
        local.get 1
        i32.const -1
        i32.le_s
        local.set 2
      end
      block  ;; label = @2
        block  ;; label = @3
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 2
            br_if 1 (;@3;)
            local.get 3
            i32.const 8
            i32.add
            local.get 1
            i32.const 1
            call 74
            local.get 3
            i32.load offset=8
            local.tee 2
            br_if 2 (;@2;)
            i32.const 1054048
            i32.load
            local.tee 3
            i32.const 3
            local.get 3
            select
            local.set 0
          end
          local.get 4
          i32.eqz
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 1
            i32.const 1
            local.get 0
            call_indirect (type 1)
            i32.const 0
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            unreachable
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          call 25
          unreachable
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i32.load offset=12
        local.set 1
        local.get 0
        local.get 2
        i32.store
        local.get 0
        local.get 1
        i32.store offset=4
        local.get 3
        i32.const 16
        i32.add
        global.set 0
      end
      return
    end
    local.set 4
    global.get 4
    i32.load
    local.get 4
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 4
    local.get 0
    i32.store
    local.get 4
    local.get 1
    i32.store offset=4
    local.get 4
    local.get 3
    i32.store offset=8
    local.get 4
    local.get 2
    i32.store offset=12
    global.get 4
    global.get 4
    i32.load
    i32.const 16
    i32.add
    i32.store)
  (func (;18;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32)
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        i32.const 9
        i32.ge_u
        if  ;; label = @3
          i32.const -65587
          local.get 1
          i32.const 16
          local.get 1
          i32.const 16
          i32.gt_u
          select
          local.tee 1
          i32.sub
          local.get 0
          i32.le_u
          br_if 1 (;@2;)
          i32.const 16
          local.get 0
          i32.const 11
          i32.add
          i32.const -8
          i32.and
          local.get 0
          i32.const 11
          i32.lt_u
          select
          local.tee 3
          local.get 1
          i32.add
          i32.const 12
          i32.add
          call 19
          local.tee 0
          i32.eqz
          br_if 1 (;@2;)
          local.get 0
          i32.const 8
          i32.sub
          local.set 2
          block  ;; label = @4
            local.get 1
            i32.const 1
            i32.sub
            local.tee 4
            local.get 0
            i32.and
            i32.eqz
            if  ;; label = @5
              local.get 2
              local.set 1
              br 1 (;@4;)
            end
            local.get 0
            i32.const 4
            i32.sub
            i32.load
            local.set 5
            i32.const 0
            local.get 1
            local.get 0
            local.get 4
            i32.add
            i32.const 0
            local.get 1
            i32.sub
            i32.and
            i32.const 8
            i32.sub
            local.tee 0
            local.get 2
            i32.sub
            i32.const 16
            i32.gt_u
            select
            local.set 1
            local.get 5
            i32.const -8
            i32.and
            local.get 0
            local.get 1
            i32.add
            local.tee 1
            local.get 2
            i32.sub
            local.tee 0
            i32.sub
            local.set 4
            local.get 5
            i32.const 3
            i32.and
            if  ;; label = @5
              local.get 1
              local.get 4
              call 20
              local.get 2
              local.get 0
              call 20
              local.get 2
              local.get 0
              call 21
              br 1 (;@4;)
            end
            local.get 2
            i32.load
            local.set 2
            local.get 1
            local.get 4
            i32.store offset=4
            local.get 1
            local.get 0
            local.get 2
            i32.add
            i32.store
          end
          local.get 1
          i32.load offset=4
          local.tee 0
          i32.const 3
          i32.and
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          i32.const -8
          i32.and
          local.tee 0
          local.get 3
          i32.const 16
          i32.add
          i32.le_u
          br_if 2 (;@1;)
          local.get 1
          local.get 3
          call 20
          local.get 1
          local.get 3
          i32.add
          local.tee 2
          local.get 0
          local.get 3
          i32.sub
          local.tee 0
          call 20
          local.get 2
          local.get 0
          call 21
          br 2 (;@1;)
        end
        local.get 0
        call 19
        local.set 2
      end
      local.get 2
      return
    end
    local.get 1
    i32.const 8
    i32.add)
  (func (;19;) (type 8) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i64)
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 0
            i32.const 245
            i32.ge_u
            if  ;; label = @5
              local.get 0
              i32.const -65587
              i32.ge_u
              br_if 4 (;@1;)
              local.get 0
              i32.const 11
              i32.add
              local.tee 0
              i32.const -8
              i32.and
              local.set 2
              i32.const 1054064
              i32.load
              local.tee 8
              i32.eqz
              br_if 3 (;@2;)
              i32.const 0
              local.get 2
              i32.sub
              local.set 1
              block (result i32)  ;; label = @6
                i32.const 0
                local.get 2
                i32.const 256
                i32.lt_u
                br_if 0 (;@6;)
                drop
                i32.const 31
                local.get 2
                i32.const 16777215
                i32.gt_u
                br_if 0 (;@6;)
                drop
                local.get 2
                i32.const 6
                local.get 0
                i32.const 8
                i32.shr_u
                i32.clz
                local.tee 0
                i32.sub
                i32.shr_u
                i32.const 1
                i32.and
                local.get 0
                i32.const 1
                i32.shl
                i32.sub
                i32.const 62
                i32.add
              end
              local.tee 7
              i32.const 2
              i32.shl
              i32.const 1054332
              i32.add
              i32.load
              local.tee 0
              if  ;; label = @6
                local.get 2
                i32.const 0
                i32.const 25
                local.get 7
                i32.const 1
                i32.shr_u
                i32.sub
                i32.const 31
                i32.and
                local.get 7
                i32.const 31
                i32.eq
                select
                i32.shl
                local.set 5
                loop  ;; label = @7
                  block  ;; label = @8
                    local.get 0
                    i32.load offset=4
                    i32.const -8
                    i32.and
                    local.tee 6
                    local.get 2
                    i32.lt_u
                    br_if 0 (;@8;)
                    local.get 6
                    local.get 2
                    i32.sub
                    local.tee 6
                    local.get 1
                    i32.ge_u
                    br_if 0 (;@8;)
                    local.get 0
                    local.set 4
                    local.get 6
                    local.tee 1
                    br_if 0 (;@8;)
                    i32.const 0
                    local.set 1
                    br 4 (;@4;)
                  end
                  local.get 0
                  i32.const 20
                  i32.add
                  i32.load
                  local.tee 6
                  local.get 3
                  local.get 6
                  local.get 5
                  i32.const 29
                  i32.shr_u
                  i32.const 4
                  i32.and
                  local.get 0
                  i32.add
                  i32.const 16
                  i32.add
                  i32.load
                  local.tee 0
                  i32.ne
                  select
                  local.get 3
                  local.get 6
                  select
                  local.set 3
                  local.get 5
                  i32.const 1
                  i32.shl
                  local.set 5
                  local.get 0
                  br_if 0 (;@7;)
                end
                local.get 3
                if  ;; label = @7
                  local.get 3
                  local.set 0
                  br 3 (;@4;)
                end
                local.get 4
                br_if 3 (;@3;)
              end
              i32.const 0
              local.set 4
              i32.const 0
              i32.const 2
              local.get 7
              i32.shl
              local.tee 0
              i32.sub
              local.set 3
              local.get 8
              local.get 0
              local.get 3
              i32.or
              i32.and
              local.tee 0
              i32.eqz
              br_if 3 (;@2;)
              i32.const 0
              local.get 0
              i32.sub
              local.get 0
              i32.and
              i32.ctz
              i32.const 2
              i32.shl
              i32.const 1054332
              i32.add
              i32.load
              local.tee 0
              br_if 1 (;@4;)
              br 3 (;@2;)
            end
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block (result i32)  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        i32.const 1054060
                        i32.load
                        local.tee 5
                        i32.const 16
                        local.get 0
                        i32.const 11
                        i32.add
                        i32.const -8
                        i32.and
                        local.get 0
                        i32.const 11
                        i32.lt_u
                        select
                        local.tee 2
                        i32.const 3
                        i32.shr_u
                        local.tee 1
                        i32.shr_u
                        local.tee 0
                        i32.const 3
                        i32.and
                        i32.eqz
                        if  ;; label = @11
                          local.get 2
                          i32.const 1054460
                          i32.load
                          i32.le_u
                          br_if 9 (;@2;)
                          local.get 0
                          br_if 1 (;@10;)
                          i32.const 1054064
                          i32.load
                          local.tee 0
                          i32.eqz
                          br_if 9 (;@2;)
                          i32.const 0
                          local.get 0
                          i32.sub
                          local.get 0
                          i32.and
                          i32.ctz
                          i32.const 2
                          i32.shl
                          i32.const 1054332
                          i32.add
                          i32.load
                          local.tee 4
                          i32.load offset=4
                          i32.const -8
                          i32.and
                          local.get 2
                          i32.sub
                          local.set 3
                          block (result i32)  ;; label = @12
                            local.get 4
                            i32.load offset=16
                            local.tee 0
                            i32.eqz
                            if  ;; label = @13
                              local.get 4
                              i32.const 20
                              i32.add
                              i32.load
                              local.set 0
                            end
                            local.get 0
                          end
                          if  ;; label = @12
                            loop  ;; label = @13
                              local.get 0
                              i32.load offset=4
                              i32.const -8
                              i32.and
                              local.get 2
                              i32.sub
                              local.tee 6
                              local.get 3
                              i32.lt_u
                              local.set 5
                              local.get 6
                              local.get 3
                              local.get 5
                              select
                              local.set 3
                              local.get 0
                              local.get 4
                              local.get 5
                              select
                              local.set 4
                              local.get 0
                              i32.load offset=16
                              local.tee 1
                              if (result i32)  ;; label = @14
                                local.get 1
                              else
                                local.get 0
                                i32.const 20
                                i32.add
                                i32.load
                              end
                              local.tee 0
                              br_if 0 (;@13;)
                            end
                          end
                          local.get 4
                          call 23
                          local.get 3
                          i32.const 16
                          i32.lt_u
                          br_if 5 (;@6;)
                          local.get 4
                          local.get 2
                          i32.const 3
                          i32.or
                          i32.store offset=4
                          local.get 2
                          local.get 4
                          i32.add
                          local.tee 2
                          local.get 3
                          i32.const 1
                          i32.or
                          i32.store offset=4
                          local.get 2
                          local.get 3
                          i32.add
                          local.get 3
                          i32.store
                          i32.const 1054460
                          i32.load
                          local.tee 0
                          i32.eqz
                          br_if 4 (;@7;)
                          local.get 0
                          i32.const 3
                          i32.shr_u
                          local.tee 5
                          i32.const 3
                          i32.shl
                          i32.const 1054068
                          i32.add
                          local.set 1
                          i32.const 1054468
                          i32.load
                          local.set 0
                          i32.const 1
                          local.get 5
                          i32.shl
                          local.tee 5
                          i32.const 1054060
                          i32.load
                          local.tee 6
                          i32.and
                          i32.eqz
                          br_if 2 (;@9;)
                          local.get 1
                          i32.load offset=8
                          br 3 (;@8;)
                        end
                        block  ;; label = @11
                          local.get 1
                          local.get 0
                          i32.const -1
                          i32.xor
                          i32.const 1
                          i32.and
                          i32.add
                          local.tee 2
                          i32.const 3
                          i32.shl
                          local.tee 3
                          i32.const 1054076
                          i32.add
                          i32.load
                          local.tee 0
                          i32.const 8
                          i32.add
                          local.tee 4
                          i32.load
                          local.tee 1
                          local.get 3
                          i32.const 1054068
                          i32.add
                          local.tee 3
                          i32.ne
                          if  ;; label = @12
                            local.get 1
                            local.get 3
                            i32.store offset=12
                            local.get 3
                            local.get 1
                            i32.store offset=8
                            br 1 (;@11;)
                          end
                          i32.const 1054060
                          local.get 5
                          i32.const -2
                          local.get 2
                          i32.rotl
                          i32.and
                          i32.store
                        end
                        local.get 0
                        local.get 2
                        i32.const 3
                        i32.shl
                        local.tee 2
                        i32.const 3
                        i32.or
                        i32.store offset=4
                        local.get 0
                        local.get 2
                        i32.add
                        i32.const 4
                        i32.add
                        local.tee 0
                        i32.load
                        i32.const 1
                        i32.or
                        local.set 1
                        local.get 0
                        local.get 1
                        i32.store
                        local.get 4
                        return
                      end
                      i32.const 0
                      i32.const 2
                      local.get 1
                      i32.const 31
                      i32.and
                      local.tee 1
                      i32.shl
                      local.tee 3
                      i32.sub
                      local.set 4
                      i32.const 0
                      local.get 3
                      local.get 4
                      i32.or
                      local.get 0
                      local.get 1
                      i32.shl
                      i32.and
                      local.tee 0
                      i32.sub
                      local.set 1
                      block  ;; label = @10
                        local.get 0
                        local.get 1
                        i32.and
                        i32.ctz
                        local.tee 1
                        i32.const 3
                        i32.shl
                        local.tee 4
                        i32.const 1054076
                        i32.add
                        i32.load
                        local.tee 0
                        i32.const 8
                        i32.add
                        local.tee 6
                        i32.load
                        local.tee 3
                        local.get 4
                        i32.const 1054068
                        i32.add
                        local.tee 4
                        i32.ne
                        if  ;; label = @11
                          local.get 3
                          local.get 4
                          i32.store offset=12
                          local.get 4
                          local.get 3
                          i32.store offset=8
                          br 1 (;@10;)
                        end
                        i32.const 1054060
                        local.get 5
                        i32.const -2
                        local.get 1
                        i32.rotl
                        i32.and
                        i32.store
                      end
                      local.get 0
                      local.get 2
                      i32.const 3
                      i32.or
                      i32.store offset=4
                      local.get 0
                      local.get 2
                      i32.add
                      local.tee 3
                      local.get 1
                      i32.const 3
                      i32.shl
                      local.tee 1
                      local.get 2
                      i32.sub
                      local.tee 2
                      i32.const 1
                      i32.or
                      i32.store offset=4
                      local.get 0
                      local.get 1
                      i32.add
                      local.get 2
                      i32.store
                      i32.const 1054460
                      i32.load
                      local.tee 0
                      if  ;; label = @10
                        local.get 0
                        i32.const 3
                        i32.shr_u
                        local.tee 5
                        i32.const 3
                        i32.shl
                        i32.const 1054068
                        i32.add
                        local.set 1
                        i32.const 1054468
                        i32.load
                        local.set 0
                        block (result i32)  ;; label = @11
                          i32.const 1054060
                          i32.load
                          local.tee 4
                          i32.const 1
                          local.get 5
                          i32.shl
                          local.tee 5
                          i32.and
                          if  ;; label = @12
                            local.get 1
                            i32.load offset=8
                            br 1 (;@11;)
                          end
                          i32.const 1054060
                          local.get 4
                          local.get 5
                          i32.or
                          i32.store
                          local.get 1
                        end
                        local.set 5
                        local.get 1
                        local.get 0
                        i32.store offset=8
                        local.get 5
                        local.get 0
                        i32.store offset=12
                        local.get 0
                        local.get 1
                        i32.store offset=12
                        local.get 0
                        local.get 5
                        i32.store offset=8
                      end
                      i32.const 1054468
                      local.get 3
                      i32.store
                      i32.const 1054460
                      local.get 2
                      i32.store
                      local.get 6
                      return
                    end
                    i32.const 1054060
                    local.get 5
                    local.get 6
                    i32.or
                    i32.store
                    local.get 1
                  end
                  local.set 5
                  local.get 1
                  local.get 0
                  i32.store offset=8
                  local.get 5
                  local.get 0
                  i32.store offset=12
                  local.get 0
                  local.get 1
                  i32.store offset=12
                  local.get 0
                  local.get 5
                  i32.store offset=8
                end
                i32.const 1054468
                local.get 2
                i32.store
                i32.const 1054460
                local.get 3
                i32.store
                br 1 (;@5;)
              end
              local.get 4
              local.get 2
              local.get 3
              i32.add
              local.tee 0
              i32.const 3
              i32.or
              i32.store offset=4
              local.get 0
              local.get 4
              i32.add
              i32.const 4
              i32.add
              local.tee 0
              i32.load
              i32.const 1
              i32.or
              local.set 1
              local.get 0
              local.get 1
              i32.store
            end
            local.get 4
            i32.const 8
            i32.add
            return
          end
          loop  ;; label = @4
            local.get 2
            local.get 0
            i32.load offset=4
            i32.const -8
            i32.and
            local.tee 3
            i32.le_u
            local.set 5
            local.get 0
            local.get 4
            local.get 5
            local.get 3
            local.get 2
            i32.sub
            local.tee 6
            local.get 1
            i32.lt_u
            i32.and
            local.tee 5
            select
            local.set 4
            local.get 6
            local.get 1
            local.get 5
            select
            local.set 1
            local.get 0
            i32.load offset=16
            local.tee 3
            if (result i32)  ;; label = @5
              local.get 3
            else
              local.get 0
              i32.const 20
              i32.add
              i32.load
            end
            local.tee 0
            br_if 0 (;@4;)
          end
          local.get 4
          i32.eqz
          br_if 1 (;@2;)
        end
        i32.const 1054460
        i32.load
        local.tee 0
        local.get 2
        i32.ge_u
        i32.const 0
        local.get 1
        local.get 0
        local.get 2
        i32.sub
        i32.ge_u
        select
        br_if 0 (;@2;)
        local.get 4
        call 23
        block  ;; label = @3
          local.get 1
          i32.const 16
          i32.ge_u
          if  ;; label = @4
            local.get 4
            local.get 2
            i32.const 3
            i32.or
            i32.store offset=4
            local.get 2
            local.get 4
            i32.add
            local.tee 0
            local.get 1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 1
            i32.add
            local.get 1
            i32.store
            local.get 1
            i32.const 256
            i32.ge_u
            if  ;; label = @5
              local.get 0
              local.get 1
              call 83
              br 2 (;@3;)
            end
            local.get 1
            i32.const 3
            i32.shr_u
            local.tee 1
            i32.const 3
            i32.shl
            i32.const 1054068
            i32.add
            local.set 2
            block (result i32)  ;; label = @5
              i32.const 1
              local.get 1
              i32.shl
              local.tee 1
              i32.const 1054060
              i32.load
              local.tee 3
              i32.and
              if  ;; label = @6
                local.get 2
                i32.load offset=8
                br 1 (;@5;)
              end
              i32.const 1054060
              local.get 1
              local.get 3
              i32.or
              i32.store
              local.get 2
            end
            local.set 1
            local.get 2
            local.get 0
            i32.store offset=8
            local.get 1
            local.get 0
            i32.store offset=12
            local.get 0
            local.get 2
            i32.store offset=12
            local.get 0
            local.get 1
            i32.store offset=8
            br 1 (;@3;)
          end
          local.get 4
          local.get 1
          local.get 2
          i32.add
          local.tee 0
          i32.const 3
          i32.or
          i32.store offset=4
          local.get 0
          local.get 4
          i32.add
          i32.const 4
          i32.add
          local.tee 0
          i32.load
          i32.const 1
          i32.or
          local.set 1
          local.get 0
          local.get 1
          i32.store
        end
        local.get 4
        i32.const 8
        i32.add
        return
      end
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            i32.const 1054460
                            i32.load
                            local.tee 0
                            local.get 2
                            i32.lt_u
                            if  ;; label = @13
                              local.get 2
                              i32.const 1054464
                              i32.load
                              local.tee 0
                              i32.lt_u
                              br_if 4 (;@9;)
                              i32.const 0
                              local.set 1
                              local.get 2
                              i32.const 65583
                              i32.add
                              local.tee 3
                              i32.const 16
                              i32.shr_u
                              memory.grow
                              local.tee 0
                              i32.const -1
                              i32.eq
                              local.tee 4
                              br_if 12 (;@1;)
                              local.get 0
                              i32.const 16
                              i32.shl
                              local.tee 5
                              i32.eqz
                              br_if 12 (;@1;)
                              i32.const 1054476
                              i32.const 0
                              local.get 3
                              i32.const -65536
                              i32.and
                              local.get 4
                              select
                              local.tee 6
                              i32.const 1054476
                              i32.load
                              i32.add
                              local.tee 0
                              i32.store
                              i32.const 1054480
                              i32.load
                              local.tee 1
                              local.get 0
                              i32.gt_u
                              local.set 3
                              i32.const 1054480
                              local.get 1
                              local.get 0
                              local.get 3
                              select
                              i32.store
                              i32.const 1054472
                              i32.load
                              local.tee 1
                              i32.eqz
                              br_if 1 (;@12;)
                              i32.const 1054484
                              local.set 0
                              loop  ;; label = @14
                                local.get 0
                                i32.load
                                local.tee 3
                                local.get 0
                                i32.load offset=4
                                local.tee 4
                                i32.add
                                local.get 5
                                i32.eq
                                br_if 3 (;@11;)
                                local.get 0
                                i32.load offset=8
                                local.tee 0
                                br_if 0 (;@14;)
                              end
                              br 3 (;@10;)
                            end
                            i32.const 1054468
                            i32.load
                            local.set 1
                            block  ;; label = @13
                              local.get 0
                              local.get 2
                              i32.sub
                              local.tee 3
                              i32.const 15
                              i32.le_u
                              if  ;; label = @14
                                i32.const 1054468
                                i32.const 0
                                i32.store
                                i32.const 1054460
                                i32.const 0
                                i32.store
                                local.get 1
                                local.get 0
                                i32.const 3
                                i32.or
                                i32.store offset=4
                                local.get 0
                                local.get 1
                                i32.add
                                i32.const 4
                                i32.add
                                local.tee 0
                                i32.load
                                i32.const 1
                                i32.or
                                local.set 3
                                local.get 0
                                local.get 3
                                i32.store
                                br 1 (;@13;)
                              end
                              i32.const 1054460
                              local.get 3
                              i32.store
                              i32.const 1054468
                              local.get 1
                              local.get 2
                              i32.add
                              local.tee 5
                              i32.store
                              local.get 5
                              local.get 3
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              local.get 0
                              local.get 1
                              i32.add
                              local.get 3
                              i32.store
                              local.get 1
                              local.get 2
                              i32.const 3
                              i32.or
                              i32.store offset=4
                            end
                            local.get 1
                            i32.const 8
                            i32.add
                            return
                          end
                          i32.const 1054504
                          i32.load
                          local.tee 0
                          i32.eqz
                          br_if 3 (;@8;)
                          local.get 0
                          local.get 5
                          i32.gt_u
                          br_if 3 (;@8;)
                          br 8 (;@3;)
                        end
                        local.get 0
                        i32.load offset=12
                        br_if 0 (;@10;)
                        local.get 1
                        local.get 3
                        i32.lt_u
                        br_if 0 (;@10;)
                        local.get 1
                        local.get 5
                        i32.lt_u
                        br_if 3 (;@7;)
                      end
                      local.get 5
                      i32.const 1054504
                      i32.load
                      local.tee 0
                      i32.gt_u
                      local.set 3
                      i32.const 1054504
                      local.get 0
                      local.get 5
                      local.get 3
                      select
                      i32.store
                      local.get 5
                      local.get 6
                      i32.add
                      local.set 4
                      i32.const 1054484
                      local.set 0
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            loop  ;; label = @13
                              local.get 4
                              local.get 0
                              i32.load
                              i32.eq
                              br_if 1 (;@12;)
                              local.get 0
                              i32.load offset=8
                              local.tee 0
                              br_if 0 (;@13;)
                            end
                            br 1 (;@11;)
                          end
                          local.get 0
                          i32.load offset=12
                          i32.eqz
                          br_if 1 (;@10;)
                        end
                        i32.const 1054484
                        local.set 0
                        loop  ;; label = @11
                          block  ;; label = @12
                            local.get 1
                            local.get 0
                            i32.load
                            local.tee 3
                            i32.ge_u
                            if  ;; label = @13
                              local.get 0
                              i32.load offset=4
                              local.get 3
                              i32.add
                              local.tee 3
                              local.get 1
                              i32.gt_u
                              br_if 1 (;@12;)
                            end
                            local.get 0
                            i32.load offset=8
                            local.set 0
                            br 1 (;@11;)
                          end
                        end
                        i32.const 1054472
                        local.get 5
                        i32.store
                        i32.const 1054464
                        local.get 6
                        i32.const 40
                        i32.sub
                        local.tee 0
                        i32.store
                        local.get 5
                        local.get 0
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get 4
                        i32.const 36
                        i32.sub
                        i32.const 40
                        i32.store
                        i32.const 1054500
                        i32.const 2097152
                        i32.store
                        local.get 3
                        i32.const 32
                        i32.sub
                        i32.const -8
                        i32.and
                        i32.const 8
                        i32.sub
                        local.tee 0
                        local.get 1
                        i32.const 16
                        i32.add
                        i32.lt_u
                        local.set 4
                        local.get 1
                        local.get 0
                        local.get 4
                        select
                        local.tee 4
                        i32.const 27
                        i32.store offset=4
                        i32.const 1054484
                        i64.load align=4
                        local.set 9
                        local.get 4
                        i32.const 16
                        i32.add
                        i32.const 1054492
                        i64.load align=4
                        i64.store align=4
                        local.get 4
                        local.get 9
                        i64.store offset=8 align=4
                        i32.const 1054488
                        local.get 6
                        i32.store
                        i32.const 1054484
                        local.get 5
                        i32.store
                        i32.const 1054492
                        local.get 4
                        i32.const 8
                        i32.add
                        i32.store
                        i32.const 1054496
                        i32.const 0
                        i32.store
                        local.get 4
                        i32.const 28
                        i32.add
                        local.set 0
                        loop  ;; label = @11
                          local.get 0
                          i32.const 7
                          i32.store
                          local.get 3
                          local.get 0
                          i32.const 4
                          i32.add
                          local.tee 0
                          i32.gt_u
                          br_if 0 (;@11;)
                        end
                        local.get 1
                        local.get 4
                        i32.eq
                        br_if 8 (;@2;)
                        local.get 4
                        i32.const 4
                        i32.add
                        local.tee 0
                        i32.load
                        i32.const -2
                        i32.and
                        local.set 3
                        local.get 0
                        local.get 3
                        i32.store
                        local.get 1
                        local.get 4
                        local.get 1
                        i32.sub
                        local.tee 0
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get 4
                        local.get 0
                        i32.store
                        local.get 0
                        i32.const 256
                        i32.ge_u
                        if  ;; label = @11
                          local.get 1
                          local.get 0
                          call 83
                          br 9 (;@2;)
                        end
                        local.get 0
                        i32.const 3
                        i32.shr_u
                        local.tee 3
                        i32.const 3
                        i32.shl
                        i32.const 1054068
                        i32.add
                        local.set 0
                        block (result i32)  ;; label = @11
                          i32.const 1
                          local.get 3
                          i32.shl
                          local.tee 3
                          i32.const 1054060
                          i32.load
                          local.tee 5
                          i32.and
                          if  ;; label = @12
                            local.get 0
                            i32.load offset=8
                            br 1 (;@11;)
                          end
                          i32.const 1054060
                          local.get 3
                          local.get 5
                          i32.or
                          i32.store
                          local.get 0
                        end
                        local.set 3
                        local.get 0
                        local.get 1
                        i32.store offset=8
                        local.get 3
                        local.get 1
                        i32.store offset=12
                        local.get 1
                        local.get 0
                        i32.store offset=12
                        local.get 1
                        local.get 3
                        i32.store offset=8
                        br 8 (;@2;)
                      end
                      local.get 0
                      local.get 5
                      i32.store
                      local.get 0
                      local.get 6
                      local.get 0
                      i32.load offset=4
                      i32.add
                      i32.store offset=4
                      local.get 5
                      local.get 2
                      i32.const 3
                      i32.or
                      i32.store offset=4
                      local.get 4
                      local.get 2
                      local.get 5
                      i32.add
                      local.tee 0
                      i32.sub
                      local.set 2
                      i32.const 1054472
                      i32.load
                      local.get 4
                      i32.ne
                      if  ;; label = @10
                        local.get 4
                        i32.const 1054468
                        i32.load
                        i32.eq
                        br_if 4 (;@6;)
                        local.get 4
                        i32.load offset=4
                        local.tee 1
                        i32.const 3
                        i32.and
                        i32.const 1
                        i32.ne
                        br_if 5 (;@5;)
                        block  ;; label = @11
                          local.get 1
                          i32.const -8
                          i32.and
                          local.tee 3
                          i32.const 256
                          i32.ge_u
                          if  ;; label = @12
                            local.get 4
                            call 23
                            br 1 (;@11;)
                          end
                          local.get 4
                          i32.const 12
                          i32.add
                          i32.load
                          local.tee 6
                          local.get 4
                          i32.const 8
                          i32.add
                          i32.load
                          local.tee 7
                          i32.ne
                          if  ;; label = @12
                            local.get 7
                            local.get 6
                            i32.store offset=12
                            local.get 6
                            local.get 7
                            i32.store offset=8
                            br 1 (;@11;)
                          end
                          i32.const 1054060
                          i32.const 1054060
                          i32.load
                          i32.const -2
                          local.get 1
                          i32.const 3
                          i32.shr_u
                          i32.rotl
                          i32.and
                          i32.store
                        end
                        local.get 2
                        local.get 3
                        i32.add
                        local.set 2
                        local.get 3
                        local.get 4
                        i32.add
                        local.set 4
                        br 5 (;@5;)
                      end
                      i32.const 1054472
                      local.get 0
                      i32.store
                      i32.const 1054464
                      local.get 2
                      i32.const 1054464
                      i32.load
                      i32.add
                      local.tee 2
                      i32.store
                      local.get 0
                      local.get 2
                      i32.const 1
                      i32.or
                      i32.store offset=4
                      br 5 (;@4;)
                    end
                    i32.const 1054464
                    local.get 0
                    local.get 2
                    i32.sub
                    local.tee 1
                    i32.store
                    i32.const 1054472
                    local.get 2
                    i32.const 1054472
                    i32.load
                    local.tee 0
                    i32.add
                    local.tee 3
                    i32.store
                    local.get 3
                    local.get 1
                    i32.const 1
                    i32.or
                    i32.store offset=4
                    local.get 0
                    local.get 2
                    i32.const 3
                    i32.or
                    i32.store offset=4
                    local.get 0
                    i32.const 8
                    i32.add
                    local.set 1
                    br 7 (;@1;)
                  end
                  i32.const 1054504
                  local.get 5
                  i32.store
                  br 4 (;@3;)
                end
                local.get 0
                local.get 4
                local.get 6
                i32.add
                i32.store offset=4
                local.get 6
                i32.const 1054464
                i32.load
                i32.add
                local.set 0
                i32.const 1054472
                i32.const 1054472
                i32.load
                local.tee 1
                i32.const 15
                i32.add
                i32.const -8
                i32.and
                local.tee 3
                i32.const 8
                i32.sub
                i32.store
                i32.const 1054464
                local.get 1
                local.get 3
                i32.sub
                local.get 0
                i32.add
                i32.const 8
                i32.add
                local.tee 4
                i32.store
                local.get 3
                i32.const 4
                i32.sub
                local.get 4
                i32.const 1
                i32.or
                i32.store
                local.get 0
                local.get 1
                i32.add
                i32.const 4
                i32.add
                i32.const 40
                i32.store
                i32.const 1054500
                i32.const 2097152
                i32.store
                br 4 (;@2;)
              end
              i32.const 1054468
              local.get 0
              i32.store
              i32.const 1054460
              local.get 2
              i32.const 1054460
              i32.load
              i32.add
              local.tee 2
              i32.store
              local.get 0
              local.get 2
              i32.const 1
              i32.or
              i32.store offset=4
              local.get 0
              local.get 2
              i32.add
              local.get 2
              i32.store
              br 1 (;@4;)
            end
            local.get 4
            local.get 4
            i32.load offset=4
            i32.const -2
            i32.and
            i32.store offset=4
            local.get 0
            local.get 2
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 2
            i32.add
            local.get 2
            i32.store
            local.get 2
            i32.const 256
            i32.ge_u
            if  ;; label = @5
              local.get 0
              local.get 2
              call 83
              br 1 (;@4;)
            end
            local.get 2
            i32.const 3
            i32.shr_u
            local.tee 1
            i32.const 3
            i32.shl
            i32.const 1054068
            i32.add
            local.set 2
            block (result i32)  ;; label = @5
              i32.const 1
              local.get 1
              i32.shl
              local.tee 1
              i32.const 1054060
              i32.load
              local.tee 3
              i32.and
              if  ;; label = @6
                local.get 2
                i32.load offset=8
                br 1 (;@5;)
              end
              i32.const 1054060
              local.get 1
              local.get 3
              i32.or
              i32.store
              local.get 2
            end
            local.set 1
            local.get 2
            local.get 0
            i32.store offset=8
            local.get 1
            local.get 0
            i32.store offset=12
            local.get 0
            local.get 2
            i32.store offset=12
            local.get 0
            local.get 1
            i32.store offset=8
          end
          local.get 5
          i32.const 8
          i32.add
          return
        end
        i32.const 1054508
        i32.const 4095
        i32.store
        i32.const 1054488
        local.get 6
        i32.store
        i32.const 1054484
        local.get 5
        i32.store
        i32.const 1054080
        i32.const 1054068
        i32.store
        i32.const 1054088
        i32.const 1054076
        i32.store
        i32.const 1054076
        i32.const 1054068
        i32.store
        i32.const 1054096
        i32.const 1054084
        i32.store
        i32.const 1054084
        i32.const 1054076
        i32.store
        i32.const 1054104
        i32.const 1054092
        i32.store
        i32.const 1054092
        i32.const 1054084
        i32.store
        i32.const 1054112
        i32.const 1054100
        i32.store
        i32.const 1054100
        i32.const 1054092
        i32.store
        i32.const 1054120
        i32.const 1054108
        i32.store
        i32.const 1054108
        i32.const 1054100
        i32.store
        i32.const 1054128
        i32.const 1054116
        i32.store
        i32.const 1054116
        i32.const 1054108
        i32.store
        i32.const 1054136
        i32.const 1054124
        i32.store
        i32.const 1054124
        i32.const 1054116
        i32.store
        i32.const 1054496
        i32.const 0
        i32.store
        i32.const 1054144
        i32.const 1054132
        i32.store
        i32.const 1054132
        i32.const 1054124
        i32.store
        i32.const 1054140
        i32.const 1054132
        i32.store
        i32.const 1054152
        i32.const 1054140
        i32.store
        i32.const 1054148
        i32.const 1054140
        i32.store
        i32.const 1054160
        i32.const 1054148
        i32.store
        i32.const 1054156
        i32.const 1054148
        i32.store
        i32.const 1054168
        i32.const 1054156
        i32.store
        i32.const 1054164
        i32.const 1054156
        i32.store
        i32.const 1054176
        i32.const 1054164
        i32.store
        i32.const 1054172
        i32.const 1054164
        i32.store
        i32.const 1054184
        i32.const 1054172
        i32.store
        i32.const 1054180
        i32.const 1054172
        i32.store
        i32.const 1054192
        i32.const 1054180
        i32.store
        i32.const 1054188
        i32.const 1054180
        i32.store
        i32.const 1054200
        i32.const 1054188
        i32.store
        i32.const 1054196
        i32.const 1054188
        i32.store
        i32.const 1054208
        i32.const 1054196
        i32.store
        i32.const 1054216
        i32.const 1054204
        i32.store
        i32.const 1054204
        i32.const 1054196
        i32.store
        i32.const 1054224
        i32.const 1054212
        i32.store
        i32.const 1054212
        i32.const 1054204
        i32.store
        i32.const 1054232
        i32.const 1054220
        i32.store
        i32.const 1054220
        i32.const 1054212
        i32.store
        i32.const 1054240
        i32.const 1054228
        i32.store
        i32.const 1054228
        i32.const 1054220
        i32.store
        i32.const 1054248
        i32.const 1054236
        i32.store
        i32.const 1054236
        i32.const 1054228
        i32.store
        i32.const 1054256
        i32.const 1054244
        i32.store
        i32.const 1054244
        i32.const 1054236
        i32.store
        i32.const 1054264
        i32.const 1054252
        i32.store
        i32.const 1054252
        i32.const 1054244
        i32.store
        i32.const 1054272
        i32.const 1054260
        i32.store
        i32.const 1054260
        i32.const 1054252
        i32.store
        i32.const 1054280
        i32.const 1054268
        i32.store
        i32.const 1054268
        i32.const 1054260
        i32.store
        i32.const 1054288
        i32.const 1054276
        i32.store
        i32.const 1054276
        i32.const 1054268
        i32.store
        i32.const 1054296
        i32.const 1054284
        i32.store
        i32.const 1054284
        i32.const 1054276
        i32.store
        i32.const 1054304
        i32.const 1054292
        i32.store
        i32.const 1054292
        i32.const 1054284
        i32.store
        i32.const 1054312
        i32.const 1054300
        i32.store
        i32.const 1054300
        i32.const 1054292
        i32.store
        i32.const 1054320
        i32.const 1054308
        i32.store
        i32.const 1054308
        i32.const 1054300
        i32.store
        i32.const 1054328
        i32.const 1054316
        i32.store
        i32.const 1054316
        i32.const 1054308
        i32.store
        i32.const 1054472
        local.get 5
        i32.store
        i32.const 1054324
        i32.const 1054316
        i32.store
        i32.const 1054464
        local.get 6
        i32.const 40
        i32.sub
        local.tee 0
        i32.store
        local.get 5
        local.get 0
        i32.const 1
        i32.or
        i32.store offset=4
        local.get 5
        local.get 6
        i32.add
        i32.const 36
        i32.sub
        i32.const 40
        i32.store
        i32.const 1054500
        i32.const 2097152
        i32.store
      end
      i32.const 0
      local.set 1
      local.get 2
      i32.const 1054464
      i32.load
      local.tee 0
      i32.ge_u
      br_if 0 (;@1;)
      i32.const 1054464
      local.get 0
      local.get 2
      i32.sub
      local.tee 1
      i32.store
      i32.const 1054472
      local.get 2
      i32.const 1054472
      i32.load
      local.tee 0
      i32.add
      local.tee 3
      i32.store
      local.get 3
      local.get 1
      i32.const 1
      i32.or
      i32.store offset=4
      local.get 0
      local.get 2
      i32.const 3
      i32.or
      i32.store offset=4
      local.get 0
      i32.const 8
      i32.add
      return
    end
    local.get 1)
  (func (;20;) (type 1) (param i32 i32)
    local.get 0
    local.get 0
    i32.load offset=4
    i32.const 1
    i32.and
    local.get 1
    i32.or
    i32.const 2
    i32.or
    i32.store offset=4
    local.get 0
    local.get 1
    i32.add
    i32.const 4
    i32.add
    local.tee 0
    i32.load
    i32.const 1
    i32.or
    local.set 1
    local.get 0
    local.get 1
    i32.store)
  (func (;21;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32)
    local.get 0
    local.get 1
    i32.add
    local.set 2
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 0
          i32.load offset=4
          local.tee 3
          i32.const 1
          i32.and
          br_if 0 (;@3;)
          local.get 3
          i32.const 3
          i32.and
          i32.eqz
          br_if 1 (;@2;)
          local.get 0
          i32.load
          local.tee 3
          local.get 1
          i32.add
          local.set 1
          local.get 0
          local.get 3
          i32.sub
          local.tee 0
          i32.const 1054468
          i32.load
          i32.eq
          if  ;; label = @4
            local.get 2
            i32.load offset=4
            i32.const 3
            i32.and
            i32.const 3
            i32.ne
            br_if 1 (;@3;)
            i32.const 1054460
            local.get 1
            i32.store
            local.get 2
            local.get 2
            i32.load offset=4
            i32.const -2
            i32.and
            i32.store offset=4
            local.get 0
            local.get 1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 2
            local.get 1
            i32.store
            return
          end
          local.get 3
          i32.const 256
          i32.ge_u
          if  ;; label = @4
            local.get 0
            call 23
            br 1 (;@3;)
          end
          local.get 0
          i32.const 12
          i32.add
          i32.load
          local.tee 4
          local.get 0
          i32.const 8
          i32.add
          i32.load
          local.tee 5
          i32.ne
          if  ;; label = @4
            local.get 5
            local.get 4
            i32.store offset=12
            local.get 4
            local.get 5
            i32.store offset=8
            br 1 (;@3;)
          end
          i32.const 1054060
          i32.const 1054060
          i32.load
          i32.const -2
          local.get 3
          i32.const 3
          i32.shr_u
          i32.rotl
          i32.and
          i32.store
        end
        local.get 2
        i32.load offset=4
        local.tee 3
        i32.const 2
        i32.and
        if  ;; label = @3
          local.get 2
          local.get 3
          i32.const -2
          i32.and
          i32.store offset=4
          local.get 0
          local.get 1
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 0
          local.get 1
          i32.add
          local.get 1
          i32.store
          br 2 (;@1;)
        end
        block  ;; label = @3
          local.get 2
          i32.const 1054472
          i32.load
          i32.ne
          if  ;; label = @4
            i32.const 1054468
            i32.load
            local.get 2
            i32.ne
            br_if 1 (;@3;)
            i32.const 1054468
            local.get 0
            i32.store
            i32.const 1054460
            i32.const 1054460
            i32.load
            local.get 1
            i32.add
            local.tee 1
            i32.store
            local.get 0
            local.get 1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 1
            i32.add
            local.get 1
            i32.store
            return
          end
          i32.const 1054472
          local.get 0
          i32.store
          i32.const 1054464
          i32.const 1054464
          i32.load
          local.get 1
          i32.add
          local.tee 1
          i32.store
          local.get 0
          local.get 1
          i32.const 1
          i32.or
          i32.store offset=4
          i32.const 1054468
          i32.load
          local.get 0
          i32.ne
          br_if 1 (;@2;)
          i32.const 1054460
          i32.const 0
          i32.store
          i32.const 1054468
          i32.const 0
          i32.store
          return
        end
        local.get 3
        i32.const -8
        i32.and
        local.tee 4
        local.get 1
        i32.add
        local.set 1
        block  ;; label = @3
          local.get 4
          i32.const 256
          i32.ge_u
          if  ;; label = @4
            local.get 2
            call 23
            br 1 (;@3;)
          end
          local.get 2
          i32.const 12
          i32.add
          i32.load
          local.tee 4
          local.get 2
          i32.const 8
          i32.add
          i32.load
          local.tee 2
          i32.ne
          if  ;; label = @4
            local.get 2
            local.get 4
            i32.store offset=12
            local.get 4
            local.get 2
            i32.store offset=8
            br 1 (;@3;)
          end
          i32.const 1054060
          i32.const 1054060
          i32.load
          i32.const -2
          local.get 3
          i32.const 3
          i32.shr_u
          i32.rotl
          i32.and
          i32.store
        end
        local.get 0
        local.get 1
        i32.const 1
        i32.or
        i32.store offset=4
        local.get 0
        local.get 1
        i32.add
        local.get 1
        i32.store
        i32.const 1054468
        i32.load
        local.get 0
        i32.ne
        br_if 1 (;@1;)
        i32.const 1054460
        local.get 1
        i32.store
      end
      return
    end
    local.get 1
    i32.const 256
    i32.ge_u
    if  ;; label = @1
      local.get 0
      local.get 1
      call 83
      return
    end
    local.get 1
    i32.const 3
    i32.shr_u
    local.tee 2
    i32.const 3
    i32.shl
    i32.const 1054068
    i32.add
    local.set 1
    block (result i32)  ;; label = @1
      i32.const 1
      local.get 2
      i32.shl
      local.tee 2
      i32.const 1054060
      i32.load
      local.tee 3
      i32.and
      if  ;; label = @2
        local.get 1
        i32.load offset=8
        br 1 (;@1;)
      end
      i32.const 1054060
      local.get 2
      local.get 3
      i32.or
      i32.store
      local.get 1
    end
    local.set 2
    local.get 1
    local.get 0
    i32.store offset=8
    local.get 2
    local.get 0
    i32.store offset=12
    local.get 0
    local.get 1
    i32.store offset=12
    local.get 0
    local.get 2
    i32.store offset=8)
  (func (;22;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    block  ;; label = @1
      local.get 1
      i32.const -65588
      i32.gt_u
      br_if 0 (;@1;)
      i32.const 16
      local.get 1
      i32.const 11
      i32.add
      i32.const -8
      i32.and
      local.get 1
      i32.const 11
      i32.lt_u
      select
      local.set 2
      local.get 0
      i32.const 4
      i32.sub
      local.tee 7
      i32.load
      local.tee 5
      i32.const -8
      i32.and
      local.set 3
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  local.get 5
                  i32.const 3
                  i32.and
                  if  ;; label = @8
                    local.get 0
                    i32.const 8
                    i32.sub
                    local.set 5
                    local.get 2
                    local.get 3
                    i32.le_u
                    br_if 1 (;@7;)
                    local.get 3
                    local.get 5
                    i32.add
                    local.tee 6
                    i32.const 1054472
                    i32.load
                    i32.eq
                    br_if 2 (;@6;)
                    i32.const 1054468
                    i32.load
                    local.get 6
                    i32.eq
                    br_if 3 (;@5;)
                    local.get 6
                    i32.load offset=4
                    local.tee 8
                    i32.const 2
                    i32.and
                    br_if 6 (;@2;)
                    local.get 8
                    i32.const -8
                    i32.and
                    local.tee 9
                    local.get 3
                    i32.add
                    local.tee 3
                    local.get 2
                    i32.ge_u
                    br_if 4 (;@4;)
                    br 6 (;@2;)
                  end
                  local.get 2
                  i32.const 256
                  i32.lt_u
                  br_if 5 (;@2;)
                  local.get 2
                  i32.const 4
                  i32.or
                  local.get 3
                  i32.gt_u
                  br_if 5 (;@2;)
                  local.get 3
                  local.get 2
                  i32.sub
                  i32.const 131073
                  i32.ge_u
                  br_if 5 (;@2;)
                  br 4 (;@3;)
                end
                local.get 3
                local.get 2
                i32.sub
                local.tee 1
                i32.const 16
                i32.lt_u
                br_if 3 (;@3;)
                local.get 5
                local.get 2
                call 20
                local.get 2
                local.get 5
                i32.add
                local.tee 4
                local.get 1
                call 20
                local.get 4
                local.get 1
                call 21
                br 3 (;@3;)
              end
              i32.const 1054464
              i32.load
              local.get 3
              i32.add
              local.tee 3
              local.get 2
              i32.le_u
              br_if 3 (;@2;)
              local.get 5
              local.get 2
              call 20
              local.get 2
              local.get 5
              i32.add
              local.tee 1
              local.get 3
              local.get 2
              i32.sub
              local.tee 4
              i32.const 1
              i32.or
              i32.store offset=4
              i32.const 1054464
              local.get 4
              i32.store
              i32.const 1054472
              local.get 1
              i32.store
              br 2 (;@3;)
            end
            i32.const 1054460
            i32.load
            local.get 3
            i32.add
            local.tee 3
            local.get 2
            i32.lt_u
            br_if 2 (;@2;)
            block  ;; label = @5
              local.get 3
              local.get 2
              i32.sub
              local.tee 1
              i32.const 15
              i32.le_u
              if  ;; label = @6
                local.get 5
                local.get 3
                call 20
                i32.const 0
                local.set 1
                br 1 (;@5;)
              end
              local.get 5
              local.get 2
              call 20
              local.get 2
              local.get 5
              i32.add
              local.tee 4
              local.get 1
              i32.const 1
              i32.or
              i32.store offset=4
              local.get 1
              local.get 4
              i32.add
              local.tee 2
              local.get 1
              i32.store
              local.get 2
              i32.const 4
              i32.add
              local.tee 2
              i32.load
              i32.const -2
              i32.and
              local.set 3
              local.get 2
              local.get 3
              i32.store
            end
            i32.const 1054468
            local.get 4
            i32.store
            i32.const 1054460
            local.get 1
            i32.store
            br 1 (;@3;)
          end
          local.get 3
          local.get 2
          i32.sub
          local.set 1
          block  ;; label = @4
            local.get 9
            i32.const 256
            i32.ge_u
            if  ;; label = @5
              local.get 6
              call 23
              br 1 (;@4;)
            end
            local.get 6
            i32.const 12
            i32.add
            i32.load
            local.tee 4
            local.get 6
            i32.const 8
            i32.add
            i32.load
            local.tee 7
            i32.ne
            if  ;; label = @5
              local.get 7
              local.get 4
              i32.store offset=12
              local.get 4
              local.get 7
              i32.store offset=8
              br 1 (;@4;)
            end
            i32.const 1054060
            i32.const 1054060
            i32.load
            i32.const -2
            local.get 8
            i32.const 3
            i32.shr_u
            i32.rotl
            i32.and
            i32.store
          end
          local.get 1
          i32.const 16
          i32.ge_u
          if  ;; label = @4
            local.get 5
            local.get 2
            call 20
            local.get 2
            local.get 5
            i32.add
            local.tee 4
            local.get 1
            call 20
            local.get 4
            local.get 1
            call 21
            br 1 (;@3;)
          end
          local.get 5
          local.get 3
          call 20
        end
        local.get 0
        local.set 4
        br 1 (;@1;)
      end
      local.get 1
      call 19
      local.tee 2
      i32.eqz
      br_if 0 (;@1;)
      i32.const -4
      i32.const -8
      local.get 7
      i32.load
      local.tee 4
      i32.const 3
      i32.and
      select
      local.set 3
      local.get 3
      local.get 4
      i32.const -8
      i32.and
      i32.add
      local.tee 4
      local.get 1
      i32.gt_u
      local.set 3
      local.get 2
      local.get 0
      local.get 1
      local.get 4
      local.get 3
      select
      call 85
      local.set 1
      local.get 0
      call 24
      local.get 1
      return
    end
    local.get 4)
  (func (;23;) (type 3) (param i32)
    (local i32 i32 i32 i32 i32)
    local.get 0
    i32.load offset=24
    local.set 4
    block  ;; label = @1
      block  ;; label = @2
        local.get 0
        local.get 0
        i32.load offset=12
        local.tee 1
        i32.eq
        if  ;; label = @3
          i32.const 20
          i32.const 16
          local.get 0
          i32.const 20
          i32.add
          local.tee 1
          i32.load
          local.tee 3
          select
          local.get 0
          i32.add
          i32.load
          local.tee 2
          br_if 1 (;@2;)
          i32.const 0
          local.set 1
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=8
        local.tee 2
        local.get 1
        i32.store offset=12
        local.get 1
        local.get 2
        i32.store offset=8
        br 1 (;@1;)
      end
      local.get 1
      local.get 0
      i32.const 16
      i32.add
      local.get 3
      select
      local.set 3
      loop  ;; label = @2
        local.get 3
        local.set 5
        local.get 2
        local.tee 1
        i32.const 20
        i32.add
        local.tee 3
        i32.load
        local.tee 2
        i32.eqz
        if  ;; label = @3
          local.get 1
          i32.const 16
          i32.add
          local.set 3
          local.get 1
          i32.load offset=16
          local.set 2
        end
        local.get 2
        br_if 0 (;@2;)
      end
      local.get 5
      i32.const 0
      i32.store
    end
    block  ;; label = @1
      local.get 4
      i32.eqz
      br_if 0 (;@1;)
      block  ;; label = @2
        local.get 0
        local.get 0
        i32.load offset=28
        i32.const 2
        i32.shl
        i32.const 1054332
        i32.add
        local.tee 2
        i32.load
        i32.ne
        if  ;; label = @3
          local.get 4
          i32.const 16
          i32.const 20
          local.get 4
          i32.load offset=16
          local.get 0
          i32.eq
          select
          i32.add
          local.get 1
          i32.store
          local.get 1
          br_if 1 (;@2;)
          br 2 (;@1;)
        end
        local.get 2
        local.get 1
        i32.store
        local.get 1
        br_if 0 (;@2;)
        i32.const 1054064
        i32.const 1054064
        i32.load
        i32.const -2
        local.get 0
        i32.load offset=28
        i32.rotl
        i32.and
        i32.store
        return
      end
      local.get 1
      local.get 4
      i32.store offset=24
      local.get 0
      i32.load offset=16
      local.tee 2
      if  ;; label = @2
        local.get 1
        local.get 2
        i32.store offset=16
        local.get 2
        local.get 1
        i32.store offset=24
      end
      local.get 0
      i32.const 20
      i32.add
      i32.load
      local.tee 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      i32.const 20
      i32.add
      local.get 2
      i32.store
      local.get 2
      local.get 1
      i32.store offset=24
    end)
  (func (;24;) (type 3) (param i32)
    (local i32 i32 i32 i32 i32)
    local.get 0
    i32.const 8
    i32.sub
    local.set 1
    local.get 1
    local.get 0
    i32.const 4
    i32.sub
    i32.load
    local.tee 3
    i32.const -8
    i32.and
    local.tee 0
    i32.add
    local.set 2
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 3
          i32.const 1
          i32.and
          br_if 0 (;@3;)
          local.get 3
          i32.const 3
          i32.and
          i32.eqz
          br_if 1 (;@2;)
          local.get 1
          i32.load
          local.tee 3
          local.get 0
          i32.add
          local.set 0
          local.get 1
          local.get 3
          i32.sub
          local.tee 1
          i32.const 1054468
          i32.load
          i32.eq
          if  ;; label = @4
            local.get 2
            i32.load offset=4
            i32.const 3
            i32.and
            i32.const 3
            i32.ne
            br_if 1 (;@3;)
            i32.const 1054460
            local.get 0
            i32.store
            local.get 2
            local.get 2
            i32.load offset=4
            i32.const -2
            i32.and
            i32.store offset=4
            local.get 1
            local.get 0
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 1
            i32.add
            local.get 0
            i32.store
            return
          end
          local.get 3
          i32.const 256
          i32.ge_u
          if  ;; label = @4
            local.get 1
            call 23
            br 1 (;@3;)
          end
          local.get 1
          i32.const 12
          i32.add
          i32.load
          local.tee 4
          local.get 1
          i32.const 8
          i32.add
          i32.load
          local.tee 5
          i32.ne
          if  ;; label = @4
            local.get 5
            local.get 4
            i32.store offset=12
            local.get 4
            local.get 5
            i32.store offset=8
            br 1 (;@3;)
          end
          i32.const 1054060
          i32.const 1054060
          i32.load
          i32.const -2
          local.get 3
          i32.const 3
          i32.shr_u
          i32.rotl
          i32.and
          i32.store
        end
        block  ;; label = @3
          local.get 2
          i32.load offset=4
          local.tee 3
          i32.const 2
          i32.and
          if  ;; label = @4
            local.get 2
            local.get 3
            i32.const -2
            i32.and
            i32.store offset=4
            local.get 1
            local.get 0
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 1
            i32.add
            local.get 0
            i32.store
            br 1 (;@3;)
          end
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                local.get 2
                i32.const 1054472
                i32.load
                i32.ne
                if  ;; label = @7
                  i32.const 1054468
                  i32.load
                  local.get 2
                  i32.ne
                  br_if 1 (;@6;)
                  i32.const 1054468
                  local.get 1
                  i32.store
                  i32.const 1054460
                  i32.const 1054460
                  i32.load
                  local.get 0
                  i32.add
                  local.tee 0
                  i32.store
                  local.get 1
                  local.get 0
                  i32.const 1
                  i32.or
                  i32.store offset=4
                  local.get 0
                  local.get 1
                  i32.add
                  local.get 0
                  i32.store
                  return
                end
                i32.const 1054472
                local.get 1
                i32.store
                i32.const 1054464
                i32.const 1054464
                i32.load
                local.get 0
                i32.add
                local.tee 0
                i32.store
                local.get 1
                local.get 0
                i32.const 1
                i32.or
                i32.store offset=4
                local.get 1
                i32.const 1054468
                i32.load
                i32.eq
                br_if 1 (;@5;)
                br 2 (;@4;)
              end
              local.get 3
              i32.const -8
              i32.and
              local.tee 4
              local.get 0
              i32.add
              local.set 0
              block  ;; label = @6
                local.get 4
                i32.const 256
                i32.ge_u
                if  ;; label = @7
                  local.get 2
                  call 23
                  br 1 (;@6;)
                end
                local.get 2
                i32.const 12
                i32.add
                i32.load
                local.tee 4
                local.get 2
                i32.const 8
                i32.add
                i32.load
                local.tee 2
                i32.ne
                if  ;; label = @7
                  local.get 2
                  local.get 4
                  i32.store offset=12
                  local.get 4
                  local.get 2
                  i32.store offset=8
                  br 1 (;@6;)
                end
                i32.const 1054060
                i32.const 1054060
                i32.load
                i32.const -2
                local.get 3
                i32.const 3
                i32.shr_u
                i32.rotl
                i32.and
                i32.store
              end
              local.get 1
              local.get 0
              i32.const 1
              i32.or
              i32.store offset=4
              local.get 0
              local.get 1
              i32.add
              local.get 0
              i32.store
              local.get 1
              i32.const 1054468
              i32.load
              i32.ne
              br_if 2 (;@3;)
              i32.const 1054460
              local.get 0
              i32.store
              br 3 (;@2;)
            end
            i32.const 1054460
            i32.const 0
            i32.store
            i32.const 1054468
            i32.const 0
            i32.store
          end
          i32.const 1054500
          i32.load
          local.get 0
          i32.ge_u
          br_if 1 (;@2;)
          i32.const 1054472
          i32.load
          local.tee 0
          i32.eqz
          br_if 1 (;@2;)
          block  ;; label = @4
            i32.const 1054464
            i32.load
            i32.const 41
            i32.lt_u
            br_if 0 (;@4;)
            i32.const 1054484
            local.set 1
            loop  ;; label = @5
              local.get 0
              local.get 1
              i32.load
              local.tee 2
              i32.ge_u
              if  ;; label = @6
                local.get 1
                i32.load offset=4
                local.get 2
                i32.add
                local.get 0
                i32.gt_u
                br_if 2 (;@4;)
              end
              local.get 1
              i32.load offset=8
              local.tee 1
              br_if 0 (;@5;)
            end
          end
          call 84
          i32.const 1054464
          i32.load
          i32.const 1054500
          i32.load
          i32.le_u
          br_if 1 (;@2;)
          i32.const 1054500
          i32.const -1
          i32.store
          return
        end
        local.get 0
        i32.const 256
        i32.lt_u
        br_if 1 (;@1;)
        local.get 1
        local.get 0
        call 83
        i32.const 1054508
        i32.const 1054508
        i32.load
        i32.const 1
        i32.sub
        local.tee 1
        i32.store
        local.get 1
        br_if 0 (;@2;)
        call 84
        return
      end
      return
    end
    local.get 0
    i32.const 3
    i32.shr_u
    local.tee 2
    i32.const 3
    i32.shl
    i32.const 1054068
    i32.add
    local.set 0
    block (result i32)  ;; label = @1
      i32.const 1
      local.get 2
      i32.shl
      local.tee 2
      i32.const 1054060
      i32.load
      local.tee 3
      i32.and
      if  ;; label = @2
        local.get 0
        i32.load offset=8
        br 1 (;@1;)
      end
      i32.const 1054060
      local.get 2
      local.get 3
      i32.or
      i32.store
      local.get 0
    end
    local.set 2
    local.get 0
    local.get 1
    i32.store offset=8
    local.get 2
    local.get 1
    i32.store offset=12
    local.get 1
    local.get 0
    i32.store offset=12
    local.get 1
    local.get 2
    i32.store offset=8)
  (func (;25;) (type 6)
    i32.const 1049224
    i32.const 17
    i32.const 1049244
    call 26
    unreachable)
  (func (;26;) (type 4) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 20
    i32.add
    i32.const 0
    i32.store
    local.get 3
    i32.const 1053952
    i32.store offset=16
    local.get 3
    i64.const 1
    i64.store offset=4 align=4
    local.get 3
    local.get 1
    i32.store offset=28
    local.get 3
    local.get 0
    i32.store offset=24
    local.get 3
    local.get 3
    i32.const 24
    i32.add
    i32.store
    local.get 3
    local.get 2
    call 40
    unreachable)
  (func (;27;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 16
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 2
      local.get 3
      i32.load offset=12
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 16
        i32.sub
        local.tee 3
        global.set 0
        local.get 1
        local.get 2
        i32.add
        local.tee 2
        local.get 1
        i32.lt_u
        local.set 1
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 1
          br_if 1 (;@2;)
          local.get 0
          i32.const 4
          i32.add
          i32.load
          local.tee 1
          i32.const 1
          i32.shl
          local.tee 4
          local.get 2
          local.get 2
          local.get 4
          i32.lt_u
          select
          local.tee 2
          i32.const 8
          i32.gt_u
          local.set 4
          local.get 3
          local.get 2
          i32.const 8
          local.get 4
          select
          local.tee 2
          local.get 0
          i32.load
          i32.const 0
          local.get 1
          select
          local.get 1
          call 28
          local.get 3
          i32.load
          i32.const 1
          i32.ne
          local.set 1
        end
        block  ;; label = @3
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 1
            br_if 1 (;@3;)
            local.get 3
            i32.const 8
            i32.add
            i32.load
            local.tee 0
            i32.eqz
            br_if 2 (;@2;)
            local.get 3
            i32.load offset=4
            local.set 1
            i32.const 1054048
            i32.load
            local.tee 3
            i32.const 3
            local.get 3
            select
            local.set 2
          end
          local.get 5
          i32.eqz
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 1
            local.get 0
            local.get 2
            call_indirect (type 1)
            i32.const 0
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            unreachable
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          local.get 3
          i64.load offset=4 align=4
          i64.store align=4
          local.get 3
          i32.const 16
          i32.add
          global.set 0
          return
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        call 25
        unreachable
      end
      return
    end
    local.set 4
    global.get 4
    i32.load
    local.get 4
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 4
    local.get 0
    i32.store
    local.get 4
    local.get 1
    i32.store offset=4
    local.get 4
    local.get 2
    i32.store offset=8
    local.get 4
    local.get 3
    i32.store offset=12
    global.get 4
    global.get 4
    i32.load
    i32.const 16
    i32.add
    i32.store)
  (func (;28;) (type 5) (param i32 i32 i32 i32)
    local.get 0
    block (result i32)  ;; label = @1
      local.get 1
      i32.const 0
      i32.lt_s
      if  ;; label = @2
        i32.const 0
        local.set 1
        i32.const 1
        br 1 (;@1;)
      end
      block  ;; label = @2
        block  ;; label = @3
          block (result i32)  ;; label = @4
            block  ;; label = @5
              local.get 2
              if  ;; label = @6
                local.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 1
                  br_if 2 (;@5;)
                  i32.const 1
                  local.set 2
                  br 4 (;@3;)
                end
                local.get 2
                local.get 1
                call 22
                br 2 (;@4;)
              end
              local.get 1
              br_if 0 (;@5;)
              i32.const 1
              local.set 2
              br 2 (;@3;)
            end
            local.get 1
            call 19
          end
          local.tee 2
          i32.eqz
          br_if 1 (;@2;)
        end
        local.get 0
        local.get 2
        i32.store offset=4
        i32.const 0
        br 1 (;@1;)
      end
      local.get 0
      local.get 1
      i32.store offset=4
      i32.const 1
      local.set 1
      i32.const 1
    end
    i32.store
    local.get 0
    i32.const 8
    i32.add
    local.get 1
    i32.store)
  (func (;29;) (type 1) (param i32 i32)
    nop)
  (func (;30;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 24
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 4
      i32.load
      local.set 0
      local.get 4
      i32.load offset=8
      local.set 2
      local.get 4
      i32.load offset=12
      local.set 3
      local.get 4
      i32.load offset=16
      local.set 5
      local.get 4
      i32.load offset=20
      local.set 6
      local.get 4
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 7
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 32
        i32.sub
        local.tee 6
        global.set 0
        local.get 1
        i32.const 20
        i32.add
        i32.load
        local.set 9
        local.get 1
        i32.load
        local.set 8
        block  ;; label = @3
          local.get 1
          i32.const 4
          i32.add
          i32.load
          local.tee 10
          i32.const 3
          i32.shl
          local.tee 2
          i32.eqz
          if  ;; label = @4
            i32.const 0
            local.set 3
            br 1 (;@3;)
          end
          local.get 2
          i32.const 8
          i32.sub
          local.tee 2
          i32.const 3
          i32.shr_u
          i32.const 1
          i32.add
          local.tee 5
          i32.const 7
          i32.and
          local.set 4
          block (result i32)  ;; label = @4
            local.get 2
            i32.const 56
            i32.lt_u
            if  ;; label = @5
              i32.const 0
              local.set 3
              local.get 8
              br 1 (;@4;)
            end
            local.get 8
            i32.const 60
            i32.add
            local.set 2
            i32.const 0
            local.set 3
            i32.const 0
            local.get 5
            i32.const 1073741816
            i32.and
            i32.sub
            local.set 5
            loop  ;; label = @5
              local.get 2
              i32.load
              local.get 2
              i32.const 8
              i32.sub
              i32.load
              local.get 2
              i32.const 16
              i32.sub
              i32.load
              local.get 2
              i32.const 24
              i32.sub
              i32.load
              local.get 2
              i32.const 32
              i32.sub
              i32.load
              local.get 2
              i32.const 40
              i32.sub
              i32.load
              local.get 2
              i32.const 48
              i32.sub
              i32.load
              local.get 2
              i32.const 56
              i32.sub
              i32.load
              local.get 3
              i32.add
              i32.add
              i32.add
              i32.add
              i32.add
              i32.add
              i32.add
              i32.add
              local.set 3
              local.get 2
              i32.const -64
              i32.sub
              local.set 2
              local.get 5
              i32.const 8
              i32.add
              local.tee 5
              br_if 0 (;@5;)
            end
            local.get 2
            i32.const 60
            i32.sub
          end
          local.set 5
          local.get 4
          i32.eqz
          local.tee 2
          br_if 0 (;@3;)
          i32.const 0
          local.get 4
          i32.sub
          local.set 2
          local.get 5
          i32.const 4
          i32.add
          local.set 5
          loop  ;; label = @4
            local.get 5
            i32.load
            local.get 3
            i32.add
            local.set 3
            local.get 2
            i32.const 1
            i32.add
            local.tee 4
            local.get 2
            i32.ge_u
            local.set 11
            local.get 4
            local.set 2
            local.get 5
            i32.const 8
            i32.add
            local.set 5
            local.get 11
            br_if 0 (;@4;)
          end
        end
      end
      block  ;; label = @2
        block  ;; label = @3
          global.get 3
          i32.eqz
          if  ;; label = @4
            block  ;; label = @5
              local.get 9
              i32.eqz
              if  ;; label = @6
                local.get 3
                local.set 2
                br 1 (;@5;)
              end
              block  ;; label = @6
                local.get 10
                i32.eqz
                br_if 0 (;@6;)
                local.get 8
                i32.load offset=4
                br_if 0 (;@6;)
                local.get 3
                i32.const 16
                i32.lt_u
                br_if 3 (;@3;)
              end
              local.get 3
              local.get 3
              local.get 3
              i32.add
              local.tee 2
              i32.gt_u
              local.tee 3
              br_if 2 (;@3;)
            end
            i32.const 0
            local.set 3
            block  ;; label = @5
              local.get 2
              i32.const 0
              i32.ge_s
              if  ;; label = @6
                local.get 2
                i32.eqz
                if  ;; label = @7
                  i32.const 1
                  local.set 5
                  br 5 (;@2;)
                end
                local.get 2
                call 19
                local.tee 5
                i32.eqz
                br_if 1 (;@5;)
                local.get 2
                local.set 3
                br 4 (;@2;)
              end
              call 25
              unreachable
            end
            i32.const 1054048
            i32.load
            local.tee 3
            i32.const 3
            local.get 3
            select
            local.set 0
          end
          local.get 7
          i32.eqz
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 2
            i32.const 1
            local.get 0
            call_indirect (type 1)
            i32.const 0
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            unreachable
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          i32.const 1
          local.set 5
          i32.const 0
          local.set 3
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.const 0
        i32.store offset=8
        local.get 0
        local.get 3
        i32.store offset=4
        local.get 0
        local.get 5
        i32.store
        local.get 6
        local.get 0
        i32.store offset=4
        local.get 6
        i32.const 24
        i32.add
        local.get 1
        i32.const 16
        i32.add
        i64.load align=4
        i64.store
        local.get 6
        i32.const 16
        i32.add
        local.get 1
        i32.const 8
        i32.add
        i64.load align=4
        i64.store
        local.get 6
        local.get 1
        i64.load align=4
        i64.store offset=8
        local.get 6
        i32.const 4
        i32.add
        local.set 1
        local.get 6
        i32.const 8
        i32.add
        local.set 0
      end
      local.get 7
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 1
        i32.const 1049156
        local.get 0
        call 31
        local.set 4
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 4
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        if  ;; label = @3
          i32.const 1049260
          i32.const 51
          local.get 6
          i32.const 8
          i32.add
          i32.const 1049180
          i32.const 1049336
          call 12
          unreachable
        end
        local.get 6
        i32.const 32
        i32.add
        global.set 0
      end
      return
    end
    local.set 4
    global.get 4
    i32.load
    local.get 4
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 4
    local.get 0
    i32.store
    local.get 4
    local.get 1
    i32.store offset=4
    local.get 4
    local.get 2
    i32.store offset=8
    local.get 4
    local.get 3
    i32.store offset=12
    local.get 4
    local.get 5
    i32.store offset=16
    local.get 4
    local.get 6
    i32.store offset=20
    global.get 4
    global.get 4
    i32.load
    i32.const 24
    i32.add
    i32.store)
  (func (;31;) (type 2) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 48
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=8
      local.set 2
      local.get 3
      i32.load offset=12
      local.set 4
      local.get 3
      i32.load offset=16
      local.set 5
      local.get 3
      i32.load offset=20
      local.set 6
      local.get 3
      i32.load offset=24
      local.set 7
      local.get 3
      i32.load offset=28
      local.set 8
      local.get 3
      i32.load offset=32
      local.set 9
      local.get 3
      i32.load offset=36
      local.set 10
      local.get 3
      i32.load offset=40
      local.set 12
      local.get 3
      i32.load offset=44
      local.set 13
      local.get 3
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 11
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 48
        i32.sub
        local.tee 5
        global.set 0
        local.get 5
        i32.const 36
        i32.add
        local.tee 7
        local.get 1
        i32.store
        local.get 5
        i32.const 3
        i32.store8 offset=40
        local.get 5
        i64.const 137438953472
        i64.store offset=8
        local.get 5
        local.get 0
        i32.store offset=32
        local.get 5
        i32.const 0
        i32.store offset=24
        local.get 5
        i32.const 0
        i32.store offset=16
        local.get 2
        i32.load offset=8
        local.set 12
        i32.const 0
        local.set 9
      end
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 12
                br_if 1 (;@5;)
                local.get 2
                i32.const 20
                i32.add
                i32.load
                local.tee 7
                i32.eqz
                local.tee 0
                br_if 2 (;@4;)
                local.get 2
                i32.load
                local.set 1
                local.get 7
                i32.const 3
                i32.shl
                i32.const 8
                i32.sub
                i32.const 3
                i32.shr_u
                i32.const 1
                i32.add
                local.tee 9
                local.set 7
                local.get 2
                i32.load offset=16
                local.set 0
              end
              loop  ;; label = @6
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 1
                  i32.const 4
                  i32.add
                  i32.load
                  local.tee 4
                  i32.eqz
                  local.set 6
                end
                block  ;; label = @7
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    local.get 6
                    br_if 1 (;@7;)
                    local.get 1
                    i32.load
                    local.set 8
                    local.get 5
                    i32.load offset=36
                    i32.load offset=12
                    local.set 10
                    local.get 5
                    i32.load offset=32
                    local.set 6
                  end
                  local.get 11
                  i32.eqz
                  i32.const 1
                  global.get 3
                  select
                  if  ;; label = @8
                    local.get 6
                    local.get 8
                    local.get 4
                    local.get 10
                    call_indirect (type 2)
                    local.set 3
                    i32.const 0
                    global.get 3
                    i32.const 1
                    i32.eq
                    br_if 7 (;@1;)
                    drop
                    local.get 3
                    local.set 4
                  end
                  global.get 3
                  i32.eqz
                  i32.const 0
                  local.get 4
                  select
                  br_if 4 (;@3;)
                end
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 5
                  i32.const 8
                  i32.add
                  local.set 6
                  local.get 0
                  i32.const 4
                  i32.add
                  i32.load
                  local.set 8
                  local.get 0
                  i32.load
                  local.set 4
                end
                local.get 11
                i32.const 1
                i32.eq
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 4
                  local.get 6
                  local.get 8
                  call_indirect (type 0)
                  local.set 3
                  i32.const 1
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 6 (;@1;)
                  drop
                  local.get 3
                  local.set 4
                end
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 4
                  br_if 4 (;@3;)
                  local.get 0
                  i32.const 8
                  i32.add
                  local.set 0
                  local.get 1
                  i32.const 8
                  i32.add
                  local.set 1
                  local.get 7
                  i32.const 1
                  i32.sub
                  local.tee 7
                  br_if 1 (;@6;)
                end
              end
              global.get 3
              i32.eqz
              br_if 1 (;@4;)
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 2
              i32.const 12
              i32.add
              i32.load
              local.tee 0
              i32.eqz
              local.tee 1
              br_if 1 (;@4;)
              local.get 0
              i32.const 5
              i32.shl
              local.tee 13
              i32.const 32
              i32.sub
              i32.const 5
              i32.shr_u
              local.tee 0
              i32.const 1
              i32.add
              local.set 9
              i32.const 0
              local.set 7
              local.get 2
              i32.load
              local.set 1
            end
            loop  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 1
                i32.const 4
                i32.add
                i32.load
                local.tee 0
                i32.eqz
                local.set 4
              end
              block  ;; label = @6
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 4
                  br_if 1 (;@6;)
                  local.get 1
                  i32.load
                  local.set 6
                  local.get 5
                  i32.load offset=36
                  i32.load offset=12
                  local.set 8
                  local.get 5
                  i32.load offset=32
                  local.set 4
                end
                local.get 11
                i32.const 2
                i32.eq
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 4
                  local.get 6
                  local.get 0
                  local.get 8
                  call_indirect (type 2)
                  local.set 3
                  i32.const 2
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 6 (;@1;)
                  drop
                  local.get 3
                  local.set 0
                end
                global.get 3
                i32.eqz
                i32.const 0
                local.get 0
                select
                br_if 3 (;@3;)
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 5
                local.get 7
                local.get 12
                i32.add
                local.tee 0
                i32.const 28
                i32.add
                i32.load8_u
                i32.store8 offset=40
                local.get 5
                local.get 0
                i32.const 4
                i32.add
                i64.load align=4
                i64.const 32
                i64.rotl
                i64.store offset=8
                local.get 0
                i32.const 24
                i32.add
                i32.load
                local.set 6
                local.get 2
                i32.load offset=16
                local.set 10
                i32.const 0
                local.set 3
                i32.const 0
                local.set 4
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      local.get 0
                      i32.const 20
                      i32.add
                      i32.load
                      local.tee 8
                      i32.const 1
                      i32.sub
                      br_table 0 (;@9;) 2 (;@7;) 1 (;@8;)
                    end
                    local.get 10
                    local.get 6
                    i32.const 3
                    i32.shl
                    i32.add
                    local.tee 8
                    i32.load offset=4
                    i32.const 4
                    i32.ne
                    br_if 1 (;@7;)
                    local.get 8
                    i32.load
                    i32.load
                    local.set 6
                  end
                  i32.const 1
                  local.set 4
                end
                local.get 5
                local.get 6
                i32.store offset=20
                local.get 5
                local.get 4
                i32.store offset=16
                local.get 0
                i32.const 16
                i32.add
                i32.load
                local.set 4
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      local.get 0
                      i32.const 12
                      i32.add
                      i32.load
                      i32.const 1
                      i32.sub
                      br_table 0 (;@9;) 2 (;@7;) 1 (;@8;)
                    end
                    local.get 10
                    local.get 4
                    i32.const 3
                    i32.shl
                    i32.add
                    local.tee 6
                    i32.load offset=4
                    i32.const 4
                    i32.ne
                    local.tee 8
                    br_if 1 (;@7;)
                    local.get 6
                    i32.load
                    i32.load
                    local.set 4
                  end
                  i32.const 1
                  local.set 3
                end
                local.get 5
                local.get 4
                i32.store offset=28
                local.get 5
                local.get 3
                i32.store offset=24
                local.get 10
                local.get 0
                i32.load
                i32.const 3
                i32.shl
                i32.add
                local.tee 0
                i32.load
                local.set 4
                local.get 5
                i32.const 8
                i32.add
                local.set 6
                local.get 0
                i32.load offset=4
                local.set 0
              end
              local.get 11
              i32.const 3
              i32.eq
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 4
                local.get 6
                local.get 0
                call_indirect (type 0)
                local.set 3
                i32.const 3
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
                local.get 3
                local.set 0
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 0
                br_if 3 (;@3;)
                local.get 1
                i32.const 8
                i32.add
                local.set 1
                local.get 13
                local.get 7
                i32.const 32
                i32.add
                local.tee 7
                i32.ne
                local.tee 0
                br_if 1 (;@5;)
              end
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            i32.const 0
            local.set 0
            local.get 9
            local.get 2
            i32.load offset=4
            i32.lt_u
            local.tee 1
            i32.eqz
            br_if 2 (;@2;)
            local.get 5
            i32.load offset=32
            local.set 7
            local.get 2
            i32.load
            local.get 9
            i32.const 3
            i32.shl
            i32.add
            i32.const 0
            local.get 1
            select
            local.tee 1
            i32.load
            local.set 2
            local.get 5
            i32.load offset=36
            i32.load offset=12
            local.set 9
            local.get 1
            i32.load offset=4
            local.set 1
          end
          local.get 11
          i32.const 4
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 7
            local.get 2
            local.get 1
            local.get 9
            call_indirect (type 2)
            local.set 3
            i32.const 4
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 3
            local.set 1
          end
          i32.const 0
          global.get 3
          i32.eqz
          local.get 1
          select
          br_if 1 (;@2;)
        end
        local.get 0
        i32.const 1
        global.get 3
        select
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 5
        i32.const 48
        i32.add
        global.set 0
        local.get 0
        return
      end
      unreachable
    end
    local.set 3
    global.get 4
    i32.load
    local.get 3
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 3
    local.get 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 2
    i32.store offset=8
    local.get 3
    local.get 4
    i32.store offset=12
    local.get 3
    local.get 5
    i32.store offset=16
    local.get 3
    local.get 6
    i32.store offset=20
    local.get 3
    local.get 7
    i32.store offset=24
    local.get 3
    local.get 8
    i32.store offset=28
    local.get 3
    local.get 9
    i32.store offset=32
    local.get 3
    local.get 10
    i32.store offset=36
    local.get 3
    local.get 12
    i32.store offset=40
    local.get 3
    local.get 13
    i32.store offset=44
    global.get 4
    global.get 4
    i32.load
    i32.const 48
    i32.add
    i32.store
    i32.const 0)
  (func (;32;) (type 3) (param i32)
    nop)
  (func (;33;) (type 2) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 20
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 2
      local.get 3
      i32.load offset=12
      local.set 5
      local.get 3
      i32.load offset=16
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 4
      end
      global.get 3
      i32.eqz
      i32.const 0
      global.get 3
      if (result i32)  ;; label = @2
        local.get 6
      else
        local.get 0
        i32.load
        local.tee 5
        i32.const 4
        i32.add
        i32.load
        local.get 5
        i32.const 8
        i32.add
        local.tee 3
        i32.load
        local.tee 0
        i32.sub
        local.get 2
        i32.ge_u
      end
      select
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.eqz
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 5
          local.get 0
          local.get 2
          call 27
          i32.const 0
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        if (result i32)  ;; label = @3
          local.get 0
        else
          local.get 3
          i32.load
        end
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 5
        i32.load
        local.get 0
        i32.add
        local.get 1
        local.get 2
        call 85
        drop
        local.get 3
        local.get 0
        local.get 2
        i32.add
        i32.store
        i32.const 0
        return
      end
      unreachable
    end
    local.set 4
    global.get 4
    i32.load
    local.get 4
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 4
    local.get 0
    i32.store
    local.get 4
    local.get 1
    i32.store offset=4
    local.get 4
    local.get 2
    i32.store offset=8
    local.get 4
    local.get 5
    i32.store offset=12
    local.get 4
    local.get 3
    i32.store offset=16
    global.get 4
    global.get 4
    i32.load
    i32.const 20
    i32.add
    i32.store
    i32.const 0)
  (func (;34;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 24
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 8
      i32.load
      local.set 0
      local.get 8
      i32.load offset=4
      local.set 1
      local.get 8
      i32.load offset=8
      local.set 3
      local.get 8
      i32.load offset=12
      local.set 5
      local.get 8
      i32.load offset=16
      local.set 10
      local.get 8
      i32.load offset=20
      local.set 8
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 6
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 16
        i32.sub
        local.tee 5
        global.set 0
        local.get 1
        i32.const 127
        i32.gt_u
        local.set 3
        local.get 0
        i32.load
        local.set 0
      end
      block  ;; label = @2
        block  ;; label = @3
          global.get 3
          i32.eqz
          i32.const 0
          block (result i32)  ;; label = @4
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              br_if 2 (;@3;)
              local.get 0
              i32.load offset=8
              local.tee 3
              local.get 0
              i32.const 4
              i32.add
              i32.load
              i32.ne
              local.set 10
            end
            local.get 10
          end
          select
          i32.eqz
          if  ;; label = @4
            local.get 6
            i32.eqz
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 0
              local.set 9
              local.get 3
              local.set 4
              global.get 3
              i32.const 2
              i32.eq
              if  ;; label = @6
                global.get 4
                global.get 4
                i32.load
                i32.const 12
                i32.sub
                i32.store
                global.get 4
                i32.load
                local.tee 2
                i32.load
                local.set 9
                local.get 2
                i32.load offset=4
                local.set 4
                local.get 2
                i32.load offset=8
                local.set 2
              end
              block  ;; label = @6
                block (result i32)  ;; label = @7
                  global.get 3
                  i32.const 2
                  i32.eq
                  if  ;; label = @8
                    global.get 4
                    global.get 4
                    i32.load
                    i32.const 4
                    i32.sub
                    i32.store
                    global.get 4
                    i32.load
                    i32.load
                    local.set 11
                  end
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    global.get 0
                    i32.const 16
                    i32.sub
                    local.tee 2
                    global.set 0
                    local.get 4
                    i32.const 1
                    i32.add
                    local.tee 7
                    local.get 4
                    i32.lt_u
                    local.set 4
                  end
                  block  ;; label = @8
                    global.get 3
                    i32.eqz
                    if  ;; label = @9
                      local.get 4
                      br_if 1 (;@8;)
                      local.get 9
                      i32.const 4
                      i32.add
                      i32.load
                      local.tee 4
                      i32.const 1
                      i32.shl
                      local.tee 12
                      local.get 7
                      local.get 7
                      local.get 12
                      i32.lt_u
                      select
                      local.tee 7
                      i32.const 8
                      i32.gt_u
                      local.set 12
                      local.get 2
                      local.get 7
                      i32.const 8
                      local.get 12
                      select
                      local.get 9
                      i32.load
                      i32.const 0
                      local.get 4
                      select
                      local.get 4
                      call 28
                      local.get 2
                      i32.load
                      i32.const 1
                      i32.ne
                      local.set 4
                    end
                    block  ;; label = @9
                      global.get 3
                      i32.eqz
                      if  ;; label = @10
                        local.get 4
                        br_if 1 (;@9;)
                        local.get 2
                        i32.const 8
                        i32.add
                        i32.load
                        local.tee 9
                        i32.eqz
                        br_if 2 (;@8;)
                        local.get 2
                        i32.load offset=4
                        local.set 4
                        i32.const 1054048
                        i32.load
                        local.tee 2
                        i32.const 3
                        local.get 2
                        select
                        local.set 2
                      end
                      local.get 11
                      i32.eqz
                      i32.const 1
                      global.get 3
                      select
                      if  ;; label = @10
                        local.get 4
                        local.get 9
                        local.get 2
                        call_indirect (type 1)
                        i32.const 0
                        global.get 3
                        i32.const 1
                        i32.eq
                        br_if 3 (;@7;)
                        drop
                      end
                      global.get 3
                      i32.eqz
                      if  ;; label = @10
                        unreachable
                      end
                    end
                    global.get 3
                    i32.eqz
                    if  ;; label = @9
                      local.get 9
                      local.get 2
                      i64.load offset=4 align=4
                      i64.store align=4
                      local.get 2
                      i32.const 16
                      i32.add
                      global.set 0
                      br 3 (;@6;)
                    end
                  end
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    call 25
                    unreachable
                  end
                  br 1 (;@6;)
                end
                local.set 7
                global.get 4
                i32.load
                local.get 7
                i32.store
                global.get 4
                global.get 4
                i32.load
                i32.const 4
                i32.add
                i32.store
                global.get 4
                i32.load
                local.tee 7
                local.get 9
                i32.store
                local.get 7
                local.get 4
                i32.store offset=4
                local.get 7
                local.get 2
                i32.store offset=8
                global.get 4
                global.get 4
                i32.load
                i32.const 12
                i32.add
                i32.store
              end
              i32.const 0
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            if (result i32)  ;; label = @5
              local.get 3
            else
              local.get 0
              i32.load offset=8
            end
            local.set 3
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            local.get 3
            i32.const 1
            i32.add
            i32.store offset=8
            local.get 3
            local.get 0
            i32.load
            i32.add
            local.get 1
            i32.store8
            br 2 (;@2;)
          end
        end
        global.get 3
        i32.eqz
        i32.const 0
        global.get 3
        if (result i32)  ;; label = @3
          local.get 8
        else
          local.get 5
          i32.const 0
          i32.store offset=12
          block (result i32)  ;; label = @4
            local.get 1
            i32.const 2048
            i32.ge_u
            if  ;; label = @5
              local.get 1
              i32.const 65536
              i32.lt_u
              if  ;; label = @6
                local.get 5
                local.get 1
                i32.const 63
                i32.and
                i32.const 128
                i32.or
                i32.store8 offset=14
                local.get 5
                local.get 1
                i32.const 12
                i32.shr_u
                i32.const 224
                i32.or
                i32.store8 offset=12
                local.get 5
                local.get 1
                i32.const 6
                i32.shr_u
                i32.const 63
                i32.and
                i32.const 128
                i32.or
                i32.store8 offset=13
                i32.const 3
                br 2 (;@4;)
              end
              local.get 5
              local.get 1
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=15
              local.get 5
              local.get 1
              i32.const 18
              i32.shr_u
              i32.const 240
              i32.or
              i32.store8 offset=12
              local.get 5
              local.get 1
              i32.const 6
              i32.shr_u
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=14
              local.get 5
              local.get 1
              i32.const 12
              i32.shr_u
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=13
              i32.const 4
              br 1 (;@4;)
            end
            local.get 5
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 5
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 192
            i32.or
            i32.store8 offset=12
            i32.const 2
          end
          local.tee 1
          local.get 0
          i32.const 4
          i32.add
          i32.load
          local.get 0
          i32.const 8
          i32.add
          local.tee 10
          i32.load
          local.tee 3
          i32.sub
          i32.le_u
        end
        select
        i32.eqz
        if  ;; label = @3
          local.get 6
          i32.const 1
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            local.get 3
            local.get 1
            call 27
            i32.const 1
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          if (result i32)  ;; label = @4
            local.get 3
          else
            local.get 10
            i32.load
          end
          local.set 3
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 3
          local.get 0
          i32.load
          i32.add
          local.get 5
          i32.const 12
          i32.add
          local.get 1
          call 85
          drop
          local.get 10
          local.get 1
          local.get 3
          i32.add
          i32.store
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 5
        i32.const 16
        i32.add
        global.set 0
        i32.const 0
        return
      end
      unreachable
    end
    local.set 6
    global.get 4
    i32.load
    local.get 6
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 6
    local.get 0
    i32.store
    local.get 6
    local.get 1
    i32.store offset=4
    local.get 6
    local.get 3
    i32.store offset=8
    local.get 6
    local.get 5
    i32.store offset=12
    local.get 6
    local.get 10
    i32.store offset=16
    local.get 6
    local.get 8
    i32.store offset=20
    global.get 4
    global.get 4
    i32.load
    i32.const 24
    i32.add
    i32.store
    i32.const 0)
  (func (;35;) (type 0) (param i32 i32) (result i32)
    (local i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 12
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i32.load offset=4
      local.set 1
      local.get 2
      i32.load offset=8
      local.set 2
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 3
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 32
        i32.sub
        local.tee 2
        global.set 0
        local.get 2
        local.get 0
        i32.load
        i32.store offset=4
        local.get 2
        i32.const 24
        i32.add
        local.get 1
        i32.const 16
        i32.add
        i64.load align=4
        i64.store
        local.get 2
        i32.const 16
        i32.add
        local.get 1
        i32.const 8
        i32.add
        i64.load align=4
        i64.store
        local.get 2
        local.get 1
        i64.load align=4
        i64.store offset=8
        local.get 2
        i32.const 8
        i32.add
        local.set 1
        local.get 2
        i32.const 4
        i32.add
        local.set 0
      end
      local.get 3
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 0
        i32.const 1049156
        local.get 1
        call 31
        local.set 3
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 3
        local.set 1
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 2
        i32.const 32
        i32.add
        global.set 0
        local.get 1
        return
      end
      unreachable
    end
    local.set 3
    global.get 4
    i32.load
    local.get 3
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 3
    local.get 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 2
    i32.store offset=8
    global.get 4
    global.get 4
    i32.load
    i32.const 12
    i32.add
    i32.store
    i32.const 0)
  (func (;36;) (type 4) (param i32 i32 i32)
    (local i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 8
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i32.load offset=4
      local.set 2
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 3
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              local.get 2
              i32.const 0
              i32.ge_s
              if  ;; label = @6
                local.get 2
                br_if 1 (;@5;)
                i32.const 1
                local.set 4
                br 2 (;@4;)
              end
              call 25
              unreachable
            end
            local.get 2
            call 19
            local.tee 4
            i32.eqz
            br_if 1 (;@3;)
          end
          local.get 4
          local.get 1
          local.get 2
          call 85
          local.set 1
          local.get 0
          local.get 2
          i32.store offset=8
          local.get 0
          local.get 2
          i32.store offset=4
          local.get 0
          local.get 1
          i32.store
          return
        end
        i32.const 1054048
        i32.load
        local.tee 0
        i32.const 3
        local.get 0
        select
        local.set 0
      end
      local.get 3
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 2
        i32.const 1
        local.get 0
        call_indirect (type 1)
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        unreachable
      end
      return
    end
    local.set 1
    global.get 4
    i32.load
    local.get 1
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 1
    local.get 0
    i32.store
    local.get 1
    local.get 2
    i32.store offset=4
    global.get 4
    global.get 4
    i32.load
    i32.const 8
    i32.add
    i32.store)
  (func (;37;) (type 0) (param i32 i32) (result i32)
    local.get 0
    i32.load
    drop
    loop  ;; label = @1
      br 0 (;@1;)
    end
    unreachable)
  (func (;38;) (type 4) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 44
    i32.add
    i32.const 5
    i32.store
    local.get 3
    i64.const 2
    i64.store offset=12 align=4
    local.get 3
    i32.const 1049432
    i32.store offset=8
    local.get 3
    i32.const 5
    i32.store offset=36
    local.get 3
    local.get 3
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 3
    local.get 3
    i32.store offset=40
    local.get 3
    local.get 3
    i32.const 4
    i32.add
    i32.store offset=32
    local.get 3
    i32.const 8
    i32.add
    local.get 2
    call 40
    unreachable)
  (func (;39;) (type 0) (param i32 i32) (result i32)
    (local i32 i64 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 16
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i64.load offset=8 align=4
      local.set 3
      local.get 2
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 4
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i64.load32_u
        local.set 3
      end
      local.get 4
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 3
        i32.const 1
        local.get 1
        call 41
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 3
    i64.store offset=8 align=4
    global.get 4
    global.get 4
    i32.load
    i32.const 16
    i32.add
    i32.store
    i32.const 0)
  (func (;40;) (type 1) (param i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    local.get 1
    i32.store offset=12
    local.get 2
    local.get 0
    i32.store offset=8
    local.get 2
    i32.const 1049364
    i32.store offset=4
    local.get 2
    i32.const 1053952
    i32.store
    local.get 2
    i32.load offset=8
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 1053952
      i32.const 43
      i32.const 1054032
      call 26
      unreachable
    end
    local.get 0
    i32.const 20
    i32.add
    i32.load
    drop
    local.get 0
    i32.const 4
    i32.add
    i32.load
    drop
    i32.const 1
    local.set 0
    i32.const 1054056
    i32.const 1054056
    i32.load
    local.tee 1
    i32.const 1
    i32.add
    i32.store
    block  ;; label = @1
      i32.const 1054512
      i32.load
      i32.const 1
      i32.eq
      if  ;; label = @2
        i32.const 1054516
        i32.load
        i32.const 1
        i32.add
        local.set 0
        br 1 (;@1;)
      end
      i32.const 1054512
      i32.const 1
      i32.store
    end
    i32.const 1054516
    local.get 0
    i32.store
    block  ;; label = @1
      local.get 1
      i32.const 0
      i32.lt_s
      br_if 0 (;@1;)
      local.get 0
      i32.const 2
      i32.gt_u
      br_if 0 (;@1;)
      i32.const 1054052
      i32.load
      i32.const -1
      i32.le_s
      br_if 0 (;@1;)
      local.get 0
      i32.const 1
      i32.gt_u
      br_if 0 (;@1;)
      unreachable
    end
    unreachable)
  (func (;41;) (type 13) (param i64 i32 i32) (result i32)
    (local i32 i32 i32 i32 i64 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 20
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 4
      i32.load
      local.set 1
      local.get 4
      i32.load offset=8
      local.set 3
      local.get 4
      i32.load offset=12
      local.set 5
      local.get 4
      i32.load offset=16
      local.set 6
      local.get 4
      i32.load offset=4
      local.set 2
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 9
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 48
        i32.sub
        local.tee 6
        global.set 0
        i32.const 39
        local.set 3
        block  ;; label = @3
          local.get 0
          i64.const 10000
          i64.lt_u
          if  ;; label = @4
            local.get 0
            local.set 7
            br 1 (;@3;)
          end
          loop  ;; label = @4
            local.get 3
            local.get 6
            i32.const 9
            i32.add
            i32.add
            local.tee 5
            i32.const 4
            i32.sub
            local.get 0
            i64.const 10000
            i64.div_u
            local.tee 7
            i64.const -10000
            i64.mul
            local.get 0
            i64.add
            i32.wrap_i64
            local.tee 4
            i32.const 65535
            i32.and
            i32.const 100
            i32.div_u
            local.tee 8
            i32.const 1
            i32.shl
            i32.const 1049514
            i32.add
            i32.load16_u align=1
            i32.store16 align=1
            local.get 5
            i32.const 2
            i32.sub
            local.get 8
            i32.const -100
            i32.mul
            local.get 4
            i32.add
            i32.const 65535
            i32.and
            i32.const 1
            i32.shl
            i32.const 1049514
            i32.add
            i32.load16_u align=1
            i32.store16 align=1
            local.get 3
            i32.const 4
            i32.sub
            local.set 3
            local.get 0
            i64.const 99999999
            i64.gt_u
            local.set 5
            local.get 7
            local.set 0
            local.get 5
            br_if 0 (;@4;)
          end
        end
        local.get 7
        i32.wrap_i64
        local.tee 5
        i32.const 99
        i32.gt_s
        if  ;; label = @3
          local.get 7
          i32.wrap_i64
          local.tee 4
          i32.const 65535
          i32.and
          i32.const 100
          i32.div_u
          local.tee 5
          i32.const -100
          i32.mul
          local.set 8
          local.get 3
          i32.const 2
          i32.sub
          local.tee 3
          local.get 6
          i32.const 9
          i32.add
          i32.add
          local.get 4
          local.get 8
          i32.add
          i32.const 65535
          i32.and
          i32.const 1
          i32.shl
          i32.const 1049514
          i32.add
          i32.load16_u align=1
          i32.store16 align=1
        end
        block  ;; label = @3
          local.get 5
          i32.const 10
          i32.ge_s
          if  ;; label = @4
            local.get 3
            i32.const 2
            i32.sub
            local.tee 3
            local.get 6
            i32.const 9
            i32.add
            i32.add
            local.get 5
            i32.const 1
            i32.shl
            i32.const 1049514
            i32.add
            i32.load16_u align=1
            i32.store16 align=1
            br 1 (;@3;)
          end
          local.get 3
          i32.const 1
          i32.sub
          local.tee 3
          local.get 6
          i32.const 9
          i32.add
          i32.add
          local.get 5
          i32.const 48
          i32.add
          i32.store8
        end
        local.get 3
        local.get 6
        i32.const 9
        i32.add
        i32.add
        local.set 5
        i32.const 39
        local.get 3
        i32.sub
        local.set 3
      end
      local.get 9
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 2
        local.get 1
        i32.const 1053952
        i32.const 0
        local.get 5
        local.get 3
        call 43
        local.set 4
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 4
        local.set 3
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 6
        i32.const 48
        i32.add
        global.set 0
        local.get 3
        return
      end
      unreachable
    end
    local.set 4
    global.get 4
    i32.load
    local.get 4
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 4
    local.get 1
    i32.store
    local.get 4
    local.get 2
    i32.store offset=4
    local.get 4
    local.get 3
    i32.store offset=8
    local.get 4
    local.get 5
    i32.store offset=12
    local.get 4
    local.get 6
    i32.store offset=16
    global.get 4
    global.get 4
    i32.load
    i32.const 20
    i32.add
    i32.store
    i32.const 0)
  (func (;42;) (type 14) (param i32) (result i64)
    i64.const 5643155332418764368)
  (func (;43;) (type 11) (param i32 i32 i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 48
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 6
      i32.load
      local.set 0
      local.get 6
      i32.load offset=8
      local.set 2
      local.get 6
      i32.load offset=12
      local.set 3
      local.get 6
      i32.load offset=16
      local.set 4
      local.get 6
      i32.load offset=20
      local.set 5
      local.get 6
      i32.load offset=24
      local.set 7
      local.get 6
      i32.load offset=28
      local.set 8
      local.get 6
      i32.load offset=32
      local.set 9
      local.get 6
      i32.load offset=36
      local.set 10
      local.get 6
      i32.load offset=40
      local.set 11
      local.get 6
      i32.load offset=44
      local.set 13
      local.get 6
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 12
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        block (result i32)  ;; label = @3
          local.get 1
          if  ;; label = @4
            i32.const 43
            i32.const 1114112
            local.get 0
            i32.load
            local.tee 9
            i32.const 1
            i32.and
            local.tee 1
            select
            local.set 13
            local.get 1
            local.get 5
            i32.add
            br 1 (;@3;)
          end
          local.get 0
          i32.load
          local.set 9
          i32.const 45
          local.set 13
          local.get 5
          i32.const 1
          i32.add
        end
        local.set 10
        block  ;; label = @3
          local.get 9
          i32.const 4
          i32.and
          i32.eqz
          if  ;; label = @4
            i32.const 0
            local.set 2
            br 1 (;@3;)
          end
          block  ;; label = @4
            local.get 3
            i32.eqz
            if  ;; label = @5
              i32.const 0
              local.set 8
              br 1 (;@4;)
            end
            local.get 3
            i32.const 3
            i32.and
            local.tee 7
            i32.eqz
            br_if 0 (;@4;)
            i32.const 0
            local.set 8
            local.get 2
            local.set 1
            loop  ;; label = @5
              local.get 1
              i32.load8_s
              i32.const -65
              i32.gt_s
              local.tee 11
              local.get 8
              i32.add
              local.set 8
              local.get 1
              i32.const 1
              i32.add
              local.set 1
              local.get 7
              i32.const 1
              i32.sub
              local.tee 7
              br_if 0 (;@5;)
            end
          end
          local.get 8
          local.get 10
          i32.add
          local.set 10
        end
        local.get 0
        i32.load offset=8
        i32.const 1
        i32.eq
        local.set 7
        i32.const 1
        local.set 1
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        i32.const 0
        local.get 7
        select
        i32.eqz
        if  ;; label = @3
          local.get 12
          i32.eqz
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            local.get 13
            local.get 2
            local.get 3
            call 44
            local.set 6
            i32.const 0
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 6
            local.set 2
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 2
            br_if 2 (;@2;)
            local.get 0
            i32.load offset=24
            local.set 1
            local.get 0
            i32.const 28
            i32.add
            i32.load
            i32.load offset=12
            local.set 0
          end
          local.get 12
          i32.const 1
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 1
            local.get 4
            local.get 5
            local.get 0
            call_indirect (type 2)
            local.set 6
            i32.const 1
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 6
            local.set 0
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            return
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 10
          local.get 0
          i32.const 12
          i32.add
          i32.load
          local.tee 8
          i32.ge_u
          local.set 7
        end
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 7
                  i32.eqz
                  if  ;; label = @8
                    local.get 9
                    i32.const 8
                    i32.and
                    local.tee 1
                    br_if 5 (;@3;)
                    i32.const 0
                    local.set 1
                    local.get 8
                    local.get 10
                    i32.sub
                    local.tee 7
                    local.set 9
                    local.get 0
                    i32.load8_u offset=32
                    local.tee 8
                    i32.const 3
                    i32.eq
                    local.set 10
                    i32.const 1
                    local.get 8
                    local.get 10
                    select
                    i32.const 3
                    i32.and
                    local.tee 8
                    i32.const 1
                    i32.sub
                    br_table 2 (;@6;) 3 (;@5;) 4 (;@4;)
                  end
                end
                local.get 12
                i32.const 2
                i32.eq
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 0
                  local.get 13
                  local.get 2
                  local.get 3
                  call 44
                  local.set 6
                  i32.const 2
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 6 (;@1;)
                  drop
                  local.get 6
                  local.set 2
                end
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 2
                  br_if 5 (;@2;)
                  local.get 0
                  i32.load offset=24
                  local.set 1
                  local.get 0
                  i32.const 28
                  i32.add
                  i32.load
                  i32.load offset=12
                  local.set 0
                end
                local.get 12
                i32.const 3
                i32.eq
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 1
                  local.get 4
                  local.get 5
                  local.get 0
                  call_indirect (type 2)
                  local.set 6
                  i32.const 3
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 6 (;@1;)
                  drop
                  local.get 6
                  local.set 0
                end
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 0
                  return
                end
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                i32.const 0
                local.set 9
                local.get 7
                local.set 1
                br 2 (;@4;)
              end
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 7
              i32.const 1
              i32.shr_u
              local.set 1
              local.get 7
              i32.const 1
              i32.add
              local.tee 7
              i32.const 1
              i32.shr_u
              local.set 9
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            i32.const 28
            i32.add
            i32.load
            local.set 7
            local.get 0
            i32.load offset=4
            local.set 8
            local.get 0
            i32.load offset=24
            local.set 10
            local.get 1
            i32.const 1
            i32.add
            local.set 1
          end
          block  ;; label = @4
            loop  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 1
                i32.const 1
                i32.sub
                local.tee 1
                i32.eqz
                local.tee 11
                br_if 2 (;@4;)
                local.get 7
                i32.load offset=16
                local.set 11
              end
              local.get 12
              i32.const 4
              i32.eq
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 10
                local.get 8
                local.get 11
                call_indirect (type 0)
                local.set 6
                i32.const 4
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
                local.get 6
                local.set 11
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 11
                i32.eqz
                local.tee 11
                br_if 1 (;@5;)
              end
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              i32.const 1
              return
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            i32.const 1
            local.set 1
            local.get 8
            i32.const 1114112
            i32.eq
            local.tee 11
            br_if 2 (;@2;)
          end
          local.get 12
          i32.const 5
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            local.get 13
            local.get 2
            local.get 3
            call 44
            local.set 6
            i32.const 5
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 6
            local.set 0
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            br_if 2 (;@2;)
            local.get 7
            i32.load offset=12
            local.set 0
          end
          local.get 12
          i32.const 6
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 10
            local.get 4
            local.get 5
            local.get 0
            call_indirect (type 2)
            local.set 6
            i32.const 6
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 6
            local.set 0
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            br_if 2 (;@2;)
            i32.const 0
            local.set 1
          end
          block (result i32)  ;; label = @4
            loop  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 9
                local.get 1
                local.get 9
                i32.ne
                local.tee 0
                i32.eqz
                br_if 2 (;@4;)
                drop
                local.get 1
                i32.const 1
                i32.add
                local.set 1
                local.get 7
                i32.load offset=16
                local.set 0
              end
              local.get 12
              i32.const 7
              i32.eq
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 10
                local.get 8
                local.get 0
                call_indirect (type 0)
                local.set 6
                i32.const 7
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
                local.get 6
                local.set 0
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 0
                i32.eqz
                local.tee 0
                br_if 1 (;@5;)
              end
            end
            local.get 1
            local.get 1
            i32.const 1
            i32.sub
            global.get 3
            select
          end
          local.set 1
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 1
            local.get 9
            i32.lt_u
            local.set 1
            br 2 (;@2;)
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.load offset=4
          local.set 9
          local.get 0
          i32.const 48
          i32.store offset=4
          local.get 0
          i32.load8_u offset=32
          local.set 11
          local.get 0
          i32.const 1
          i32.store8 offset=32
          i32.const 1
          local.set 1
        end
        local.get 12
        i32.const 8
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 0
          local.get 13
          local.get 2
          local.get 3
          call 44
          local.set 6
          i32.const 8
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
          local.get 6
          local.set 2
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 2
          br_if 1 (;@2;)
          local.get 8
          local.get 10
          i32.sub
          i32.const 1
          i32.add
          local.set 1
          local.get 0
          i32.const 28
          i32.add
          local.tee 2
          i32.load
          local.set 8
          local.get 0
          i32.load offset=24
          local.set 7
        end
        block  ;; label = @3
          loop  ;; label = @4
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 1
              i32.const 1
              i32.sub
              local.tee 1
              i32.eqz
              local.tee 2
              br_if 2 (;@3;)
              local.get 8
              i32.load offset=16
              local.set 2
            end
            local.get 12
            i32.const 9
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 7
              i32.const 48
              local.get 2
              call_indirect (type 0)
              local.set 6
              i32.const 9
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
              local.get 6
              local.set 2
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 2
              i32.eqz
              local.tee 2
              br_if 1 (;@4;)
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            i32.const 1
            return
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 8
          i32.load offset=12
          local.set 2
          i32.const 1
          local.set 1
        end
        local.get 12
        i32.const 10
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 7
          local.get 4
          local.get 5
          local.get 2
          call_indirect (type 2)
          local.set 6
          i32.const 10
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
          local.get 6
          local.set 2
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 2
          br_if 1 (;@2;)
          local.get 0
          local.get 11
          i32.store8 offset=32
          local.get 0
          local.get 9
          i32.store offset=4
          i32.const 0
          return
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 1
        return
      end
      unreachable
    end
    local.set 6
    global.get 4
    i32.load
    local.get 6
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 6
    local.get 0
    i32.store
    local.get 6
    local.get 1
    i32.store offset=4
    local.get 6
    local.get 2
    i32.store offset=8
    local.get 6
    local.get 3
    i32.store offset=12
    local.get 6
    local.get 4
    i32.store offset=16
    local.get 6
    local.get 5
    i32.store offset=20
    local.get 6
    local.get 7
    i32.store offset=24
    local.get 6
    local.get 8
    i32.store offset=28
    local.get 6
    local.get 9
    i32.store offset=32
    local.get 6
    local.get 10
    i32.store offset=36
    local.get 6
    local.get 11
    i32.store offset=40
    local.get 6
    local.get 13
    i32.store offset=44
    global.get 4
    global.get 4
    i32.load
    i32.const 48
    i32.add
    i32.store
    i32.const 0)
  (func (;44;) (type 9) (param i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 28
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 4
      i32.load
      local.set 0
      local.get 4
      i32.load offset=8
      local.set 2
      local.get 4
      i32.load offset=12
      local.set 3
      local.get 4
      i32.load offset=16
      local.set 5
      local.get 4
      i32.load offset=20
      local.set 6
      local.get 4
      i32.load offset=24
      local.set 7
      local.get 4
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 8
      end
      local.get 5
      local.get 1
      i32.const 1114112
      i32.eq
      global.get 3
      select
      local.set 5
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 5
              br_if 1 (;@4;)
              local.get 0
              i32.load offset=24
              local.set 6
              local.get 0
              i32.const 28
              i32.add
              i32.load
              i32.load offset=16
              local.set 7
              i32.const 1
              local.set 5
            end
            local.get 8
            i32.eqz
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 6
              local.get 1
              local.get 7
              call_indirect (type 0)
              local.set 4
              i32.const 0
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
              local.get 4
              local.set 1
            end
            global.get 3
            i32.eqz
            i32.const 0
            local.get 1
            select
            br_if 1 (;@3;)
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 2
            br_if 2 (;@2;)
            i32.const 0
            local.set 5
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 5
          return
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load offset=24
        local.set 1
        local.get 0
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        local.set 0
      end
      local.get 8
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 1
        local.get 2
        local.get 3
        local.get 0
        call_indirect (type 2)
        local.set 4
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 4
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 4
    global.get 4
    i32.load
    local.get 4
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 4
    local.get 0
    i32.store
    local.get 4
    local.get 1
    i32.store offset=4
    local.get 4
    local.get 2
    i32.store offset=8
    local.get 4
    local.get 3
    i32.store offset=12
    local.get 4
    local.get 5
    i32.store offset=16
    local.get 4
    local.get 6
    i32.store offset=20
    local.get 4
    local.get 7
    i32.store offset=24
    global.get 4
    global.get 4
    i32.load
    i32.const 28
    i32.add
    i32.store
    i32.const 0)
  (func (;45;) (type 3) (param i32)
    (local i32)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 1
    global.set 0
    local.get 1
    i32.const 128
    i32.store offset=4
    local.get 1
    local.get 0
    i32.store
    local.get 1
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 1
    i32.const 44
    i32.add
    i32.const 5
    i32.store
    local.get 1
    i64.const 2
    i64.store offset=12 align=4
    local.get 1
    i32.const 1049828
    i32.store offset=8
    local.get 1
    i32.const 5
    i32.store offset=36
    local.get 1
    local.get 1
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 1
    local.get 1
    i32.const 4
    i32.add
    i32.store offset=40
    local.get 1
    local.get 1
    i32.store offset=32
    local.get 1
    i32.const 8
    i32.add
    i32.const 1049496
    call 40
    unreachable)
  (func (;46;) (type 4) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 44
    i32.add
    i32.const 5
    i32.store
    local.get 3
    i64.const 2
    i64.store offset=12 align=4
    local.get 3
    i32.const 1049860
    i32.store offset=8
    local.get 3
    i32.const 5
    i32.store offset=36
    local.get 3
    local.get 3
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 3
    local.get 3
    i32.const 4
    i32.add
    i32.store offset=40
    local.get 3
    local.get 3
    i32.store offset=32
    local.get 3
    i32.const 8
    i32.add
    local.get 2
    call 40
    unreachable)
  (func (;47;) (type 2) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 36
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 5
      i32.load
      local.set 0
      local.get 5
      i32.load offset=8
      local.set 2
      local.get 5
      i32.load offset=12
      local.set 3
      local.get 5
      i32.load offset=16
      local.set 4
      local.get 5
      i32.load offset=20
      local.set 6
      local.get 5
      i32.load offset=24
      local.set 7
      local.get 5
      i32.load offset=28
      local.set 8
      local.get 5
      i32.load offset=32
      local.set 10
      local.get 5
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 9
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load offset=16
        local.set 3
        local.get 0
        i32.load offset=8
        local.tee 10
        i32.const 1
        i32.eq
        local.set 4
      end
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 4
                br_if 1 (;@5;)
                local.get 3
                i32.const 1
                i32.eq
                local.tee 4
                br_if 2 (;@4;)
                local.get 0
                i32.load offset=24
                local.set 4
                local.get 0
                i32.const 28
                i32.add
                i32.load
                i32.load offset=12
                local.set 0
              end
              local.get 9
              i32.eqz
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 4
                local.get 1
                local.get 2
                local.get 0
                call_indirect (type 2)
                local.set 5
                i32.const 0
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
                local.get 5
                local.set 3
              end
              global.get 3
              i32.eqz
              br_if 3 (;@2;)
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i32.const 1
              i32.ne
              local.tee 4
              br_if 2 (;@3;)
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 1
            local.get 2
            i32.add
            local.set 7
            block  ;; label = @5
              block  ;; label = @6
                local.get 0
                i32.const 20
                i32.add
                i32.load
                local.tee 8
                i32.eqz
                if  ;; label = @7
                  i32.const 0
                  local.set 6
                  local.get 1
                  local.set 4
                  br 1 (;@6;)
                end
                i32.const 0
                local.set 6
                local.get 1
                local.set 4
                loop  ;; label = @7
                  local.get 7
                  local.get 4
                  local.tee 3
                  i32.eq
                  br_if 2 (;@5;)
                  block (result i32)  ;; label = @8
                    local.get 3
                    i32.const 1
                    i32.add
                    local.get 3
                    i32.load8_s
                    local.tee 4
                    i32.const -1
                    i32.gt_s
                    br_if 0 (;@8;)
                    drop
                    local.get 3
                    i32.const 2
                    i32.add
                    local.get 4
                    i32.const 255
                    i32.and
                    local.tee 4
                    i32.const 224
                    i32.lt_u
                    br_if 0 (;@8;)
                    drop
                    local.get 3
                    i32.const 3
                    i32.add
                    local.get 4
                    i32.const 240
                    i32.lt_u
                    br_if 0 (;@8;)
                    drop
                    local.get 4
                    i32.const 18
                    i32.shl
                    i32.const 1835008
                    i32.and
                    local.get 3
                    i32.load8_u offset=3
                    i32.const 63
                    i32.and
                    local.get 3
                    i32.load8_u offset=2
                    i32.const 63
                    i32.and
                    i32.const 6
                    i32.shl
                    local.get 3
                    i32.load8_u offset=1
                    i32.const 63
                    i32.and
                    i32.const 12
                    i32.shl
                    i32.or
                    i32.or
                    i32.or
                    i32.const 1114112
                    i32.eq
                    br_if 3 (;@5;)
                    local.get 3
                    i32.const 4
                    i32.add
                  end
                  local.tee 4
                  local.get 6
                  local.get 3
                  i32.sub
                  i32.add
                  local.set 6
                  local.get 8
                  i32.const 1
                  i32.sub
                  local.tee 8
                  br_if 0 (;@7;)
                end
              end
              local.get 4
              local.get 7
              i32.eq
              local.tee 3
              br_if 0 (;@5;)
              local.get 4
              i32.load8_u
              local.tee 3
              i32.const 240
              i32.lt_u
              local.tee 7
              i32.eqz
              if  ;; label = @6
                local.get 3
                i32.const 18
                i32.shl
                i32.const 1835008
                i32.and
                local.tee 3
                local.get 4
                i32.load8_u offset=1
                i32.const 63
                i32.and
                i32.const 12
                i32.shl
                local.tee 8
                local.get 4
                i32.load8_u offset=2
                i32.const 63
                i32.and
                i32.const 6
                i32.shl
                i32.or
                local.tee 7
                local.get 4
                i32.load8_u offset=3
                i32.const 63
                i32.and
                i32.or
                i32.or
                i32.const 1114112
                i32.eq
                br_if 1 (;@5;)
              end
              block  ;; label = @6
                block  ;; label = @7
                  local.get 6
                  i32.eqz
                  if  ;; label = @8
                    i32.const 0
                    local.set 4
                    br 1 (;@7;)
                  end
                  local.get 2
                  local.get 6
                  i32.le_u
                  if  ;; label = @8
                    i32.const 0
                    local.set 3
                    local.get 6
                    local.get 2
                    local.tee 4
                    i32.eq
                    local.tee 7
                    br_if 1 (;@7;)
                    br 2 (;@6;)
                  end
                  i32.const 0
                  local.set 3
                  local.get 6
                  local.tee 4
                  local.get 1
                  i32.add
                  i32.load8_s
                  i32.const -64
                  i32.lt_s
                  local.tee 7
                  br_if 1 (;@6;)
                end
                local.get 4
                local.set 6
                local.get 1
                local.set 3
              end
              local.get 6
              local.get 2
              local.get 3
              select
              local.set 2
              local.get 3
              local.get 1
              local.get 3
              select
              local.set 1
            end
            local.get 10
            i32.const 1
            i32.eq
            local.tee 4
            br_if 1 (;@3;)
            local.get 0
            i32.load offset=24
            local.set 4
            local.get 0
            i32.const 28
            i32.add
            i32.load
            i32.load offset=12
            local.set 0
          end
          local.get 9
          i32.const 1
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 4
            local.get 1
            local.get 2
            local.get 0
            call_indirect (type 2)
            local.set 5
            i32.const 1
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 5
            local.set 0
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            return
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.const 12
          i32.add
          i32.load
          local.set 7
          block  ;; label = @4
            local.get 2
            i32.eqz
            if  ;; label = @5
              i32.const 0
              local.set 4
              br 1 (;@4;)
            end
            local.get 2
            i32.const 3
            i32.and
            local.set 6
            block  ;; label = @5
              local.get 2
              i32.const 1
              i32.sub
              i32.const 3
              i32.lt_u
              if  ;; label = @6
                i32.const 0
                local.set 4
                local.get 1
                local.set 3
                br 1 (;@5;)
              end
              i32.const 0
              local.set 4
              i32.const 0
              local.get 2
              i32.const -4
              i32.and
              i32.sub
              local.set 8
              local.get 1
              local.set 3
              loop  ;; label = @6
                local.get 3
                i32.load8_s
                i32.const -65
                i32.gt_s
                local.get 4
                i32.add
                local.get 3
                i32.const 1
                i32.add
                i32.load8_s
                i32.const -65
                i32.gt_s
                i32.add
                local.get 3
                i32.const 2
                i32.add
                i32.load8_s
                i32.const -65
                i32.gt_s
                i32.add
                local.get 3
                i32.const 3
                i32.add
                i32.load8_s
                i32.const -65
                i32.gt_s
                i32.add
                local.set 4
                local.get 3
                i32.const 4
                i32.add
                local.set 3
                local.get 8
                i32.const 4
                i32.add
                local.tee 8
                br_if 0 (;@6;)
              end
            end
            local.get 6
            i32.eqz
            local.tee 8
            br_if 0 (;@4;)
            loop  ;; label = @5
              local.get 3
              i32.load8_s
              i32.const -65
              i32.gt_s
              local.tee 8
              local.get 4
              i32.add
              local.set 4
              local.get 3
              i32.const 1
              i32.add
              local.set 3
              local.get 6
              i32.const 1
              i32.sub
              local.tee 6
              br_if 0 (;@5;)
            end
          end
          local.get 4
          local.get 7
          i32.ge_u
          local.set 3
        end
        block  ;; label = @3
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            br_if 1 (;@3;)
            i32.const 0
            local.set 3
            local.get 7
            local.get 4
            i32.sub
            local.tee 6
            local.set 7
            local.get 0
            i32.load8_u offset=32
            local.tee 4
            i32.const 3
            i32.eq
            local.set 8
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  i32.const 0
                  local.get 4
                  local.get 8
                  select
                  i32.const 3
                  i32.and
                  i32.const 1
                  i32.sub
                  br_table 0 (;@7;) 1 (;@6;) 2 (;@5;)
                end
                i32.const 0
                local.set 7
                local.get 6
                local.set 3
                br 1 (;@5;)
              end
              local.get 6
              i32.const 1
              i32.shr_u
              local.set 3
              local.get 6
              i32.const 1
              i32.add
              i32.const 1
              i32.shr_u
              local.set 7
            end
            local.get 3
            i32.const 1
            i32.add
            local.set 3
            local.get 0
            i32.const 28
            i32.add
            i32.load
            local.set 6
            local.get 0
            i32.load offset=24
            local.set 8
            local.get 0
            i32.load offset=4
            local.set 4
          end
          block  ;; label = @4
            loop  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 3
                i32.const 1
                i32.sub
                local.tee 3
                i32.eqz
                local.tee 0
                br_if 2 (;@4;)
                local.get 6
                i32.load offset=16
                local.set 0
              end
              local.get 9
              i32.const 2
              i32.eq
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 8
                local.get 4
                local.get 0
                call_indirect (type 0)
                local.set 5
                i32.const 2
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
                local.get 5
                local.set 0
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 0
                i32.eqz
                local.tee 0
                br_if 1 (;@5;)
              end
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              i32.const 1
              return
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            i32.const 1
            local.set 3
            local.get 4
            i32.const 1114112
            i32.eq
            br_if 2 (;@2;)
            local.get 6
            i32.load offset=12
            local.set 0
          end
          local.get 9
          i32.const 3
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 8
            local.get 1
            local.get 2
            local.get 0
            call_indirect (type 2)
            local.set 5
            i32.const 3
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 5
            local.set 0
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            br_if 2 (;@2;)
            i32.const 0
            local.set 3
          end
          loop  ;; label = @4
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              local.get 7
              i32.eq
              if  ;; label = @6
                i32.const 0
                return
              end
              local.get 3
              i32.const 1
              i32.add
              local.set 3
              local.get 6
              i32.load offset=16
              local.set 0
            end
            local.get 9
            i32.const 4
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 8
              local.get 4
              local.get 0
              call_indirect (type 0)
              local.set 5
              i32.const 4
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
              local.get 5
              local.set 0
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 0
              i32.eqz
              local.tee 0
              br_if 1 (;@4;)
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 7
            local.get 3
            i32.const 1
            i32.sub
            i32.gt_u
            return
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.load offset=24
          local.set 4
          local.get 0
          i32.const 28
          i32.add
          i32.load
          i32.load offset=12
          local.set 0
        end
        local.get 9
        i32.const 5
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 4
          local.get 1
          local.get 2
          local.get 0
          call_indirect (type 2)
          local.set 5
          i32.const 5
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
          local.get 5
          local.set 0
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          return
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        return
      end
      unreachable
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 4
    i32.store offset=16
    local.get 5
    local.get 6
    i32.store offset=20
    local.get 5
    local.get 7
    i32.store offset=24
    local.get 5
    local.get 8
    i32.store offset=28
    local.get 5
    local.get 10
    i32.store offset=32
    global.get 4
    global.get 4
    i32.load
    i32.const 36
    i32.add
    i32.store
    i32.const 0)
  (func (;48;) (type 0) (param i32 i32) (result i32)
    (local i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 12
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 2
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load
        local.set 3
        local.get 0
        i32.load offset=4
        local.set 0
      end
      local.get 2
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 1
        local.get 3
        local.get 0
        call 47
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 3
    i32.store offset=8
    global.get 4
    global.get 4
    i32.load
    i32.const 12
    i32.add
    i32.store
    i32.const 0)
  (func (;49;) (type 0) (param i32 i32) (result i32)
    (local i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 12
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 2
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load
        local.set 3
        local.get 0
        i32.load offset=4
        i32.load offset=12
        local.set 0
      end
      local.get 2
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 3
        local.get 1
        local.get 0
        call_indirect (type 0)
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 3
    i32.store offset=8
    global.get 4
    global.get 4
    i32.load
    i32.const 12
    i32.add
    i32.store
    i32.const 0)
  (func (;50;) (type 7) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 112
    i32.sub
    local.tee 5
    global.set 0
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    block (result i32)  ;; label = @1
      block  ;; label = @2
        local.get 1
        block (result i32)  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              local.get 1
              i32.const 257
              i32.ge_u
              if  ;; label = @6
                loop  ;; label = @7
                  local.get 6
                  i32.const 256
                  i32.add
                  local.get 0
                  local.get 6
                  i32.add
                  local.tee 7
                  i32.const 256
                  i32.add
                  i32.load8_s
                  i32.const -64
                  i32.ge_s
                  br_if 4 (;@3;)
                  drop
                  local.get 6
                  i32.const 255
                  i32.add
                  local.get 7
                  i32.const 255
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  br_if 4 (;@3;)
                  drop
                  local.get 7
                  i32.const 254
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  br_if 3 (;@4;)
                  local.get 7
                  i32.const 253
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  br_if 2 (;@5;)
                  local.get 6
                  i32.const 4
                  i32.sub
                  local.tee 6
                  i32.const -256
                  i32.ne
                  br_if 0 (;@7;)
                end
                i32.const 0
                local.set 6
                br 4 (;@2;)
              end
              local.get 5
              local.get 1
              i32.store offset=20
              local.get 5
              local.get 0
              i32.store offset=16
              local.get 5
              i32.const 1053952
              i32.store offset=24
              i32.const 0
              br 4 (;@1;)
            end
            local.get 6
            i32.const 253
            i32.add
            br 1 (;@3;)
          end
          local.get 6
          i32.const 254
          i32.add
        end
        local.tee 7
        i32.gt_u
        if  ;; label = @3
          local.get 7
          local.set 6
          br 1 (;@2;)
        end
        local.get 7
        local.get 1
        local.tee 6
        i32.eq
        br_if 0 (;@2;)
        local.get 0
        local.get 1
        i32.const 0
        local.get 7
        i32.const 1050052
        call 50
        unreachable
      end
      local.get 5
      local.get 6
      i32.store offset=20
      local.get 5
      local.get 0
      i32.store offset=16
      local.get 5
      i32.const 1050068
      i32.store offset=24
      i32.const 5
    end
    i32.store offset=28
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  local.get 1
                  local.get 2
                  i32.lt_u
                  local.tee 7
                  br_if 0 (;@7;)
                  local.get 1
                  local.get 3
                  i32.lt_u
                  br_if 0 (;@7;)
                  local.get 2
                  local.get 3
                  i32.gt_u
                  br_if 1 (;@6;)
                  local.get 2
                  i32.eqz
                  br_if 2 (;@5;)
                  block  ;; label = @8
                    local.get 1
                    local.get 2
                    i32.le_u
                    if  ;; label = @9
                      local.get 1
                      local.get 2
                      i32.ne
                      br_if 1 (;@8;)
                      br 4 (;@5;)
                    end
                    local.get 0
                    local.get 2
                    i32.add
                    i32.load8_s
                    i32.const -65
                    i32.gt_s
                    br_if 3 (;@5;)
                  end
                  local.get 5
                  local.get 2
                  i32.store offset=32
                  local.get 2
                  local.set 3
                  br 3 (;@4;)
                end
                local.get 5
                local.get 2
                local.get 3
                local.get 7
                select
                i32.store offset=40
                local.get 5
                i32.const 68
                i32.add
                i32.const 3
                i32.store
                local.get 5
                i32.const 92
                i32.add
                i32.const 2
                i32.store
                local.get 5
                i32.const 84
                i32.add
                i32.const 2
                i32.store
                local.get 5
                i64.const 3
                i64.store offset=52 align=4
                local.get 5
                i32.const 1050108
                i32.store offset=48
                local.get 5
                i32.const 5
                i32.store offset=76
                local.get 5
                local.get 5
                i32.const 72
                i32.add
                i32.store offset=64
                local.get 5
                local.get 5
                i32.const 24
                i32.add
                i32.store offset=88
                local.get 5
                local.get 5
                i32.const 16
                i32.add
                i32.store offset=80
                local.get 5
                local.get 5
                i32.const 40
                i32.add
                i32.store offset=72
                local.get 5
                i32.const 48
                i32.add
                local.get 4
                call 40
                unreachable
              end
              local.get 5
              i32.const 100
              i32.add
              i32.const 2
              i32.store
              local.get 5
              i32.const 92
              i32.add
              i32.const 2
              i32.store
              local.get 5
              i32.const 84
              i32.add
              i32.const 5
              i32.store
              local.get 5
              i32.const 68
              i32.add
              i32.const 4
              i32.store
              local.get 5
              i64.const 4
              i64.store offset=52 align=4
              local.get 5
              i32.const 1050168
              i32.store offset=48
              local.get 5
              i32.const 5
              i32.store offset=76
              local.get 5
              local.get 5
              i32.const 72
              i32.add
              i32.store offset=64
              local.get 5
              local.get 5
              i32.const 24
              i32.add
              i32.store offset=96
              local.get 5
              local.get 5
              i32.const 16
              i32.add
              i32.store offset=88
              local.get 5
              local.get 5
              i32.const 12
              i32.add
              i32.store offset=80
              local.get 5
              local.get 5
              i32.const 8
              i32.add
              i32.store offset=72
              local.get 5
              i32.const 48
              i32.add
              local.get 4
              call 40
              unreachable
            end
            local.get 5
            local.get 3
            i32.store offset=32
            local.get 3
            i32.eqz
            br_if 1 (;@3;)
          end
          loop  ;; label = @4
            block  ;; label = @5
              local.get 1
              local.get 3
              i32.le_u
              if  ;; label = @6
                local.get 1
                local.get 3
                i32.eq
                br_if 5 (;@1;)
                br 1 (;@5;)
              end
              local.get 0
              local.get 3
              i32.add
              i32.load8_s
              i32.const -65
              i32.gt_s
              br_if 3 (;@2;)
            end
            local.get 3
            i32.const 1
            i32.sub
            local.tee 3
            br_if 0 (;@4;)
          end
        end
        i32.const 0
        local.set 3
      end
      local.get 1
      local.get 3
      i32.eq
      br_if 0 (;@1;)
      local.get 0
      local.get 3
      i32.add
      local.tee 0
      i32.load8_s
      local.tee 7
      i32.const 255
      i32.and
      local.set 6
      block (result i32)  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 7
            i32.const -1
            i32.le_s
            if  ;; label = @5
              local.get 0
              i32.load8_u offset=1
              i32.const 63
              i32.and
              local.set 2
              local.get 7
              i32.const 31
              i32.and
              local.set 1
              local.get 6
              i32.const 223
              i32.gt_u
              br_if 1 (;@4;)
              local.get 2
              local.get 1
              i32.const 6
              i32.shl
              i32.or
              local.set 6
              br 2 (;@3;)
            end
            local.get 5
            local.get 6
            i32.store offset=36
            i32.const 1
            br 2 (;@2;)
          end
          local.get 0
          i32.load8_u offset=2
          i32.const 63
          i32.and
          local.get 2
          i32.const 6
          i32.shl
          i32.or
          local.set 6
          local.get 7
          i32.const 255
          i32.and
          i32.const 240
          i32.lt_u
          if  ;; label = @4
            local.get 6
            local.get 1
            i32.const 12
            i32.shl
            i32.or
            local.set 6
            br 1 (;@3;)
          end
          local.get 1
          i32.const 18
          i32.shl
          i32.const 1835008
          i32.and
          local.get 0
          i32.load8_u offset=3
          i32.const 63
          i32.and
          local.get 6
          i32.const 6
          i32.shl
          i32.or
          i32.or
          local.tee 6
          i32.const 1114112
          i32.eq
          br_if 2 (;@1;)
        end
        local.get 5
        local.get 6
        i32.store offset=36
        i32.const 1
        local.get 6
        i32.const 128
        i32.lt_u
        br_if 0 (;@2;)
        drop
        i32.const 2
        local.get 6
        i32.const 2048
        i32.lt_u
        br_if 0 (;@2;)
        drop
        i32.const 3
        i32.const 4
        local.get 6
        i32.const 65536
        i32.lt_u
        select
      end
      local.set 7
      local.get 5
      local.get 3
      i32.store offset=40
      local.get 5
      local.get 3
      local.get 7
      i32.add
      i32.store offset=44
      local.get 5
      i32.const 68
      i32.add
      i32.const 5
      i32.store
      local.get 5
      i32.const 108
      i32.add
      i32.const 2
      i32.store
      local.get 5
      i32.const 100
      i32.add
      i32.const 2
      i32.store
      local.get 5
      i32.const 92
      i32.add
      i32.const 6
      i32.store
      local.get 5
      i32.const 84
      i32.add
      i32.const 7
      i32.store
      local.get 5
      i64.const 5
      i64.store offset=52 align=4
      local.get 5
      i32.const 1050252
      i32.store offset=48
      local.get 5
      i32.const 5
      i32.store offset=76
      local.get 5
      local.get 5
      i32.const 72
      i32.add
      i32.store offset=64
      local.get 5
      local.get 5
      i32.const 24
      i32.add
      i32.store offset=104
      local.get 5
      local.get 5
      i32.const 16
      i32.add
      i32.store offset=96
      local.get 5
      local.get 5
      i32.const 40
      i32.add
      i32.store offset=88
      local.get 5
      local.get 5
      i32.const 36
      i32.add
      i32.store offset=80
      local.get 5
      local.get 5
      i32.const 32
      i32.add
      i32.store offset=72
      local.get 5
      i32.const 48
      i32.add
      local.get 4
      call 40
      unreachable
    end
    i32.const 1053952
    i32.const 43
    local.get 4
    call 26
    unreachable)
  (func (;51;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 28
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i32.load offset=8
      local.set 4
      local.get 2
      i32.load offset=12
      local.set 3
      local.get 2
      i32.load offset=16
      local.set 5
      local.get 2
      i32.load offset=20
      local.set 6
      local.get 2
      i32.load offset=24
      local.set 8
      local.get 2
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 7
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 32
        i32.sub
        local.tee 4
        global.set 0
        i32.const 1
        local.set 5
      end
      local.get 7
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 0
        local.get 1
        call 55
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 3
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 3
          br_if 1 (;@2;)
          local.get 1
          i32.const 28
          i32.add
          i32.load
          local.set 3
          local.get 1
          i32.load offset=24
          local.set 8
          local.get 4
          i32.const 28
          i32.add
          i32.const 0
          i32.store
          local.get 4
          i32.const 1053952
          i32.store offset=24
          local.get 4
          i64.const 1
          i64.store offset=12 align=4
          local.get 4
          i32.const 1049356
          i32.store offset=8
          local.get 4
          i32.const 8
          i32.add
          local.set 6
        end
        local.get 7
        i32.const 1
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 8
          local.get 3
          local.get 6
          call 31
          local.set 2
          i32.const 1
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
          local.get 2
          local.set 3
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 3
          br_if 1 (;@2;)
          local.get 0
          i32.const 4
          i32.add
          local.set 0
        end
        local.get 7
        i32.const 2
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 0
          local.get 1
          call 55
          local.set 2
          i32.const 2
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
          local.get 2
          local.set 5
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.const 32
        i32.add
        global.set 0
        local.get 5
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 4
    i32.store offset=8
    local.get 2
    local.get 3
    i32.store offset=12
    local.get 2
    local.get 5
    i32.store offset=16
    local.get 2
    local.get 6
    i32.store offset=20
    local.get 2
    local.get 8
    i32.store offset=24
    global.get 4
    global.get 4
    i32.load
    i32.const 28
    i32.add
    i32.store
    i32.const 0)
  (func (;52;) (type 0) (param i32 i32) (result i32)
    (local i32 i64 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 36
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i64.load offset=8 align=4
      local.set 3
      local.get 2
      i32.load offset=16
      local.set 4
      local.get 2
      i32.load offset=20
      local.set 7
      local.get 2
      i32.load offset=24
      local.set 5
      local.get 2
      i32.load offset=28
      local.set 8
      local.get 2
      i32.load offset=32
      local.set 6
      local.get 2
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 9
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 1
        i32.load offset=24
        local.set 8
        local.get 1
        i32.const 28
        i32.add
        i32.load
        local.tee 1
        i32.load offset=16
        local.set 7
        i32.const 1
        local.set 6
      end
      local.get 9
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 8
        i32.const 39
        local.get 7
        call_indirect (type 0)
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 1
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 1
          br_if 1 (;@2;)
          i32.const 116
          local.set 4
          i32.const 2
          local.set 1
          block  ;; label = @4
            block  ;; label = @5
              block (result i64)  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            local.get 0
                            i32.load
                            local.tee 0
                            i32.const 9
                            i32.sub
                            local.tee 5
                            br_table 8 (;@4;) 3 (;@9;) 1 (;@11;) 1 (;@11;) 2 (;@10;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 1 (;@11;) 4 (;@8;) 0 (;@12;)
                          end
                          local.get 0
                          i32.const 92
                          i32.eq
                          br_if 3 (;@8;)
                        end
                        local.get 0
                        call 53
                        i32.eqz
                        br_if 3 (;@7;)
                        local.get 0
                        i32.const 1
                        i32.or
                        i32.clz
                        i32.const 2
                        i32.shr_u
                        i32.const 7
                        i32.xor
                        i64.extend_i32_u
                        i64.const 21474836480
                        i64.or
                        br 4 (;@6;)
                      end
                      i32.const 114
                      local.set 4
                      br 5 (;@4;)
                    end
                    i32.const 110
                    local.set 4
                    br 4 (;@4;)
                  end
                  local.get 0
                  local.set 4
                  br 3 (;@4;)
                end
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 0
                    i32.const 65536
                    i32.ge_u
                    if  ;; label = @9
                      local.get 0
                      i32.const 131072
                      i32.ge_u
                      br_if 1 (;@8;)
                      local.get 0
                      i32.const 1051035
                      i32.const 42
                      i32.const 1051119
                      i32.const 192
                      i32.const 1051311
                      i32.const 438
                      call 54
                      br_if 4 (;@5;)
                      br 2 (;@7;)
                    end
                    local.get 0
                    i32.const 1050364
                    i32.const 40
                    i32.const 1050444
                    i32.const 288
                    i32.const 1050732
                    i32.const 303
                    call 54
                    i32.eqz
                    br_if 1 (;@7;)
                    br 3 (;@5;)
                  end
                  local.get 0
                  i32.const 2097120
                  i32.and
                  i32.const 173792
                  i32.eq
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 177977
                  i32.sub
                  i32.const 7
                  i32.lt_u
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 2097150
                  i32.and
                  i32.const 178206
                  i32.eq
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 183970
                  i32.sub
                  i32.const 14
                  i32.lt_u
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 191457
                  i32.sub
                  i32.const 3103
                  i32.lt_u
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 195102
                  i32.sub
                  i32.const 1506
                  i32.lt_u
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 201547
                  i32.sub
                  i32.const 716213
                  i32.lt_u
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 918000
                  i32.lt_u
                  br_if 2 (;@5;)
                end
                local.get 0
                i32.const 1
                i32.or
                i32.clz
                i32.const 2
                i32.shr_u
                i32.const 7
                i32.xor
                i64.extend_i32_u
                i64.const 21474836480
                i64.or
              end
              local.set 3
              i32.const 3
              local.set 1
              local.get 0
              local.set 4
              br 1 (;@4;)
            end
            i32.const 1
            local.set 1
            local.get 0
            local.set 4
          end
        end
        loop  ;; label = @3
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 1
            local.set 5
            i32.const 0
            local.set 1
            local.get 4
            local.set 0
          end
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                global.get 3
                i32.eqz
                if  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      local.get 5
                      i32.const 1
                      i32.sub
                      br_table 5 (;@4;) 3 (;@6;) 0 (;@9;) 1 (;@8;)
                    end
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              local.get 3
                              i64.const 32
                              i64.shr_u
                              i32.wrap_i64
                              i32.const 255
                              i32.and
                              local.tee 0
                              i32.const 1
                              i32.sub
                              br_table 0 (;@13;) 4 (;@9;) 1 (;@12;) 2 (;@11;) 3 (;@10;) 5 (;@8;)
                            end
                            local.get 3
                            i64.const -1095216660481
                            i64.and
                            local.set 3
                            i32.const 125
                            local.set 0
                            i32.const 3
                            local.set 1
                            br 8 (;@4;)
                          end
                          local.get 3
                          i64.const -1095216660481
                          i64.and
                          i64.const 8589934592
                          i64.or
                          local.set 3
                          i32.const 123
                          local.set 0
                          i32.const 3
                          local.set 1
                          br 7 (;@4;)
                        end
                        local.get 3
                        i64.const -1095216660481
                        i64.and
                        i64.const 12884901888
                        i64.or
                        local.set 3
                        i32.const 117
                        local.set 0
                        i32.const 3
                        local.set 1
                        br 6 (;@4;)
                      end
                      local.get 3
                      i64.const -1095216660481
                      i64.and
                      i64.const 17179869184
                      i64.or
                      local.set 3
                      i32.const 92
                      local.set 0
                      i32.const 3
                      local.set 1
                      br 5 (;@4;)
                    end
                    i32.const 48
                    i32.const 87
                    local.get 4
                    local.get 3
                    i32.wrap_i64
                    local.tee 1
                    i32.const 2
                    i32.shl
                    i32.shr_u
                    i32.const 15
                    i32.and
                    local.tee 0
                    i32.const 10
                    i32.lt_u
                    select
                    local.set 5
                    local.get 0
                    local.get 5
                    i32.add
                    local.set 0
                    local.get 1
                    i32.eqz
                    local.tee 1
                    br_if 3 (;@5;)
                    local.get 3
                    i64.const -4294967296
                    i64.and
                    local.get 3
                    i64.const 1
                    i64.sub
                    i64.const 4294967295
                    i64.and
                    i64.or
                    local.set 3
                    i32.const 3
                    local.set 1
                    br 4 (;@4;)
                  end
                end
                local.get 9
                i32.const 1
                i32.eq
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 8
                  i32.const 39
                  local.get 7
                  call_indirect (type 0)
                  local.set 2
                  i32.const 1
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 6 (;@1;)
                  drop
                  local.get 2
                  local.set 6
                end
                global.get 3
                i32.eqz
                br_if 4 (;@2;)
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                i32.const 92
                local.set 0
                i32.const 1
                local.set 1
                br 2 (;@4;)
              end
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i64.const -1095216660481
              i64.and
              i64.const 4294967296
              i64.or
              local.set 3
              i32.const 3
              local.set 1
            end
          end
          local.get 9
          i32.const 2
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 8
            local.get 0
            local.get 7
            call_indirect (type 0)
            local.set 2
            i32.const 2
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 2
            local.set 0
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            i32.eqz
            local.tee 0
            br_if 1 (;@3;)
          end
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 6
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 3
    i64.store offset=8 align=4
    local.get 2
    local.get 4
    i32.store offset=16
    local.get 2
    local.get 7
    i32.store offset=20
    local.get 2
    local.get 5
    i32.store offset=24
    local.get 2
    local.get 8
    i32.store offset=28
    local.get 2
    local.get 6
    i32.store offset=32
    global.get 4
    global.get 4
    i32.load
    i32.const 36
    i32.add
    i32.store
    i32.const 0)
  (func (;53;) (type 8) (param i32) (result i32)
    (local i32 i32 i32 i32 i32)
    local.get 0
    i32.const 11
    i32.shl
    local.set 4
    i32.const 32
    local.set 2
    i32.const 32
    local.set 3
    block  ;; label = @1
      block  ;; label = @2
        loop  ;; label = @3
          block  ;; label = @4
            local.get 1
            local.get 2
            i32.const 1
            i32.shr_u
            i32.add
            local.tee 2
            i32.const 2
            i32.shl
            i32.const 1051848
            i32.add
            i32.load
            i32.const 11
            i32.shl
            local.tee 5
            local.get 4
            i32.ge_u
            if  ;; label = @5
              local.get 4
              local.get 5
              i32.eq
              br_if 3 (;@2;)
              local.get 2
              local.set 3
              br 1 (;@4;)
            end
            local.get 2
            i32.const 1
            i32.add
            local.set 1
          end
          local.get 3
          local.get 1
          i32.sub
          local.set 2
          local.get 1
          local.get 3
          i32.lt_u
          br_if 0 (;@3;)
        end
        br 1 (;@1;)
      end
      local.get 2
      i32.const 1
      i32.add
      local.set 1
    end
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        i32.const 31
        i32.le_u
        if  ;; label = @3
          local.get 1
          i32.const 2
          i32.shl
          local.set 2
          i32.const 707
          local.set 3
          local.get 1
          i32.const 31
          i32.ne
          if  ;; label = @4
            local.get 2
            i32.const 1051852
            i32.add
            i32.load
            i32.const 21
            i32.shr_u
            local.set 3
          end
          i32.const 0
          local.set 5
          local.get 1
          local.get 1
          i32.const 1
          i32.sub
          local.tee 4
          i32.ge_u
          if  ;; label = @4
            local.get 4
            i32.const 32
            i32.ge_u
            br_if 2 (;@2;)
            local.get 4
            i32.const 2
            i32.shl
            i32.const 1051848
            i32.add
            i32.load
            i32.const 2097151
            i32.and
            local.set 5
          end
          block  ;; label = @4
            local.get 3
            local.get 2
            i32.const 1051848
            i32.add
            i32.load
            i32.const 21
            i32.shr_u
            local.tee 1
            i32.const 1
            i32.add
            i32.eq
            br_if 0 (;@4;)
            local.get 0
            local.get 5
            i32.sub
            local.set 4
            local.get 1
            i32.const 707
            local.get 1
            i32.const 707
            i32.gt_u
            select
            local.set 2
            local.get 3
            i32.const 1
            i32.sub
            local.set 5
            i32.const 0
            local.set 3
            loop  ;; label = @5
              local.get 1
              local.get 2
              i32.eq
              br_if 4 (;@1;)
              local.get 4
              local.get 3
              local.get 1
              i32.const 1051976
              i32.add
              i32.load8_u
              i32.add
              local.tee 3
              i32.lt_u
              br_if 1 (;@4;)
              local.get 1
              i32.const 1
              i32.add
              local.tee 1
              local.get 5
              i32.ne
              br_if 0 (;@5;)
            end
            local.get 5
            local.set 1
          end
          local.get 1
          i32.const 1
          i32.and
          return
        end
        local.get 1
        i32.const 32
        i32.const 1051792
        call 38
        unreachable
      end
      local.get 4
      i32.const 32
      i32.const 1051824
      call 38
      unreachable
    end
    local.get 2
    i32.const 707
    i32.const 1051808
    call 38
    unreachable)
  (func (;54;) (type 12) (param i32 i32 i32 i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32)
    local.get 2
    i32.const 1
    i32.shl
    local.get 1
    i32.add
    local.set 11
    local.get 0
    i32.const 65280
    i32.and
    i32.const 8
    i32.shr_u
    local.set 12
    local.get 0
    i32.const 255
    i32.and
    local.set 10
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          loop  ;; label = @4
            local.get 1
            i32.const 2
            i32.add
            local.set 9
            local.get 7
            local.get 1
            i32.load8_u offset=1
            local.tee 2
            i32.add
            local.set 8
            local.get 1
            i32.load8_u
            local.tee 1
            local.get 12
            i32.ne
            if  ;; label = @5
              local.get 1
              local.get 12
              i32.gt_u
              br_if 3 (;@2;)
              local.get 8
              local.set 7
              local.get 11
              local.get 9
              local.tee 1
              i32.ne
              br_if 1 (;@4;)
              br 3 (;@2;)
            end
            local.get 7
            local.get 8
            i32.le_u
            if  ;; label = @5
              local.get 4
              local.get 8
              i32.lt_u
              br_if 2 (;@3;)
              local.get 3
              local.get 7
              i32.add
              local.set 1
              block  ;; label = @6
                loop  ;; label = @7
                  local.get 2
                  i32.eqz
                  br_if 1 (;@6;)
                  local.get 2
                  i32.const 1
                  i32.sub
                  local.set 2
                  local.get 1
                  i32.load8_u
                  local.set 7
                  local.get 1
                  i32.const 1
                  i32.add
                  local.set 1
                  local.get 7
                  local.get 10
                  i32.ne
                  br_if 0 (;@7;)
                end
                i32.const 0
                local.set 2
                br 5 (;@1;)
              end
              local.get 8
              local.set 7
              local.get 11
              local.get 9
              local.tee 1
              i32.ne
              br_if 1 (;@4;)
              br 3 (;@2;)
            end
          end
          global.get 0
          i32.const 48
          i32.sub
          local.tee 0
          global.set 0
          local.get 0
          local.get 8
          i32.store offset=4
          local.get 0
          local.get 7
          i32.store
          local.get 0
          i32.const 28
          i32.add
          i32.const 2
          i32.store
          local.get 0
          i32.const 44
          i32.add
          i32.const 5
          i32.store
          local.get 0
          i64.const 2
          i64.store offset=12 align=4
          local.get 0
          i32.const 1049912
          i32.store offset=8
          local.get 0
          i32.const 5
          i32.store offset=36
          local.get 0
          local.get 0
          i32.const 32
          i32.add
          i32.store offset=24
          local.get 0
          local.get 0
          i32.const 4
          i32.add
          i32.store offset=40
          local.get 0
          local.get 0
          i32.store offset=32
          local.get 0
          i32.const 8
          i32.add
          i32.const 1050332
          call 40
          unreachable
        end
        local.get 8
        local.get 4
        i32.const 1050332
        call 46
        unreachable
      end
      local.get 0
      i32.const 65535
      i32.and
      local.set 7
      local.get 5
      local.get 6
      i32.add
      local.set 8
      i32.const 1
      local.set 2
      block  ;; label = @2
        loop  ;; label = @3
          block (result i32)  ;; label = @4
            local.get 5
            i32.const 1
            i32.add
            local.tee 10
            local.get 5
            i32.load8_u
            local.tee 1
            i32.const 24
            i32.shl
            i32.const 24
            i32.shr_s
            local.tee 9
            i32.const 0
            i32.ge_s
            br_if 0 (;@4;)
            drop
            local.get 8
            local.get 10
            i32.eq
            br_if 2 (;@2;)
            local.get 5
            i32.load8_u offset=1
            local.get 9
            i32.const 127
            i32.and
            i32.const 8
            i32.shl
            i32.or
            local.set 1
            local.get 5
            i32.const 2
            i32.add
          end
          local.set 5
          local.get 7
          local.get 1
          i32.sub
          local.tee 7
          i32.const 0
          i32.lt_s
          br_if 2 (;@1;)
          local.get 2
          i32.const 1
          i32.xor
          local.set 2
          local.get 5
          local.get 8
          i32.ne
          br_if 0 (;@3;)
        end
        br 1 (;@1;)
      end
      i32.const 1053952
      i32.const 43
      i32.const 1050348
      call 26
      unreachable
    end
    local.get 2
    i32.const 1
    i32.and)
  (func (;55;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i64 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 24
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 4
      i32.load
      local.set 0
      local.get 4
      i32.load offset=8
      local.set 2
      local.get 4
      i32.load offset=12
      local.set 5
      local.get 4
      i64.load offset=16 align=4
      local.set 6
      local.get 4
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 7
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 128
        i32.sub
        local.tee 5
        global.set 0
        local.get 1
        i32.load
        local.tee 2
        i32.const 16
        i32.and
        local.set 3
      end
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 3
                  br_if 1 (;@6;)
                  local.get 2
                  i32.const 32
                  i32.and
                  local.tee 2
                  br_if 2 (;@5;)
                  local.get 0
                  i64.load32_u
                  local.set 6
                end
                local.get 7
                i32.eqz
                i32.const 1
                global.get 3
                select
                if  ;; label = @7
                  local.get 6
                  i32.const 1
                  local.get 1
                  call 41
                  local.set 3
                  i32.const 0
                  global.get 3
                  i32.const 1
                  i32.eq
                  br_if 6 (;@1;)
                  drop
                  local.get 3
                  local.set 0
                end
                global.get 3
                i32.eqz
                br_if 4 (;@2;)
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 0
                i32.load
                local.set 0
                i32.const 0
                local.set 2
                loop  ;; label = @7
                  i32.const 48
                  i32.const 87
                  local.get 0
                  i32.const 15
                  i32.and
                  local.tee 3
                  i32.const 10
                  i32.lt_u
                  select
                  local.set 4
                  local.get 2
                  local.get 5
                  i32.add
                  i32.const 127
                  i32.add
                  local.get 3
                  local.get 4
                  i32.add
                  i32.store8
                  local.get 2
                  i32.const 1
                  i32.sub
                  local.set 2
                  local.get 0
                  i32.const 15
                  i32.gt_u
                  local.set 3
                  local.get 0
                  i32.const 4
                  i32.shr_u
                  local.set 0
                  local.get 3
                  br_if 0 (;@7;)
                end
                local.get 2
                i32.const 128
                i32.add
                local.tee 0
                i32.const 129
                i32.ge_u
                br_if 2 (;@4;)
                local.get 2
                local.get 5
                i32.add
                i32.const 128
                i32.add
                local.set 0
                i32.const 0
                local.get 2
                i32.sub
                local.set 2
              end
              local.get 7
              i32.const 1
              i32.eq
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 1
                i32.const 1
                i32.const 1049512
                i32.const 2
                local.get 0
                local.get 2
                call 43
                local.set 3
                i32.const 1
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
                local.get 3
                local.set 0
              end
              global.get 3
              i32.eqz
              br_if 3 (;@2;)
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 0
              i32.load
              local.set 0
              i32.const 0
              local.set 2
              loop  ;; label = @6
                i32.const 48
                i32.const 55
                local.get 0
                i32.const 15
                i32.and
                local.tee 3
                i32.const 10
                i32.lt_u
                select
                local.set 4
                local.get 2
                local.get 5
                i32.add
                i32.const 127
                i32.add
                local.get 3
                local.get 4
                i32.add
                i32.store8
                local.get 2
                i32.const 1
                i32.sub
                local.set 2
                local.get 0
                i32.const 15
                i32.gt_u
                local.set 3
                local.get 0
                i32.const 4
                i32.shr_u
                local.set 0
                local.get 3
                br_if 0 (;@6;)
              end
              local.get 2
              i32.const 128
              i32.add
              local.tee 0
              i32.const 129
              i32.ge_u
              br_if 2 (;@3;)
              local.get 2
              local.get 5
              i32.add
              i32.const 128
              i32.add
              local.set 0
              i32.const 0
              local.get 2
              i32.sub
              local.set 2
            end
            local.get 7
            i32.const 2
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 1
              i32.const 1
              i32.const 1049512
              i32.const 2
              local.get 0
              local.get 2
              call 43
              local.set 3
              i32.const 2
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
              local.get 3
              local.set 0
            end
            global.get 3
            i32.eqz
            br_if 2 (;@2;)
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            call 45
            unreachable
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          call 45
          unreachable
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 5
        i32.const 128
        i32.add
        global.set 0
        local.get 0
        return
      end
      unreachable
    end
    local.set 3
    global.get 4
    i32.load
    local.get 3
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 3
    local.get 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 2
    i32.store offset=8
    local.get 3
    local.get 5
    i32.store offset=12
    local.get 3
    local.get 6
    i64.store offset=16 align=4
    global.get 4
    global.get 4
    i32.load
    i32.const 24
    i32.add
    i32.store
    i32.const 0)
  (func (;56;) (type 0) (param i32 i32) (result i32)
    (local i32 i64 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 16
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i64.load offset=8 align=4
      local.set 3
      local.get 2
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 4
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load
        local.tee 0
        i64.extend_i32_u
        local.get 0
        i32.const -1
        i32.xor
        i64.extend_i32_s
        i64.const 1
        i64.add
        local.get 0
        i32.const -1
        i32.gt_s
        local.tee 0
        select
        local.set 3
      end
      local.get 4
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 3
        local.get 0
        local.get 1
        call 41
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 3
    i64.store offset=8 align=4
    global.get 4
    global.get 4
    i32.load
    i32.const 16
    i32.add
    i32.store
    i32.const 0)
  (func (;57;) (type 0) (param i32 i32) (result i32)
    (local i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 8
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 1
      i32.load
      local.set 0
      local.get 1
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 2
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 1
        i32.load offset=24
        local.set 0
        local.get 1
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        local.set 1
      end
      local.get 2
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 0
        i32.const 1051840
        i32.const 5
        local.get 1
        call_indirect (type 2)
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    global.get 4
    global.get 4
    i32.load
    i32.const 8
    i32.add
    i32.store
    i32.const 0)
  (func (;58;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i64)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 28
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 7
      i32.load
      local.set 0
      local.get 7
      i32.load offset=4
      local.set 1
      local.get 7
      i32.load offset=8
      local.set 2
      local.get 7
      i32.load offset=12
      local.set 3
      local.get 7
      i32.load offset=16
      local.set 4
      local.get 7
      i32.load offset=20
      local.set 6
      local.get 7
      i32.load offset=24
      local.set 7
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 176
        i32.sub
        local.tee 3
        global.set 0
        local.get 3
        i32.const 152
        i32.add
        local.set 6
      end
      local.get 5
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        call 59
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      local.get 6
      local.get 3
      i32.const 80
      i32.add
      global.get 3
      select
      local.set 6
      local.get 5
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        i32.const 1048592
        i32.const 41
        call 60
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i32.const 152
        i32.add
        call 4
        local.get 3
        i32.const 160
        i32.add
        local.tee 6
        local.get 3
        i32.const 88
        i32.add
        i32.load
        i32.store
        local.get 3
        local.get 3
        i64.load offset=80
        local.tee 8
        i64.store offset=152
        local.get 3
        i32.const 40
        i32.add
        local.get 3
        i32.const 168
        i32.add
        local.tee 7
        i64.load
        i64.store
        local.get 3
        i32.const 32
        i32.add
        local.get 6
        i64.load
        i64.store
        local.get 3
        local.get 8
        i64.store offset=24
        local.get 3
        i32.const 80
        i32.add
        local.set 6
        local.get 3
        i32.const 24
        i32.add
        local.set 4
      end
      local.get 5
      i32.const 2
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        local.get 1
        local.get 2
        local.get 4
        call 61
        i32.const 2
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i32.const 24
        i32.add
        local.get 3
        i32.const 80
        i32.add
        local.tee 2
        call 62
        i32.const 0
        local.set 4
        i32.const 0
        local.set 7
        local.get 3
        i32.const 24
        i32.add
        i32.const 1048668
        call 13
        local.set 1
      end
      loop  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 1
                br_if 1 (;@5;)
                local.get 4
                i32.const 1
                i32.and
                local.tee 1
                br_if 2 (;@4;)
                local.get 3
                i32.const 80
                i32.add
                local.set 1
                local.get 3
                i32.const 24
                i32.add
                i32.const 4
                i32.or
                local.set 0
              end
              local.get 5
              i32.const 3
              i32.eq
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 0
                local.get 1
                i32.const 1048752
                i32.const 39
                call 63
                i32.const 3
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 3
                i32.const 80
                i32.add
                call 8
                local.get 3
                i32.const 88
                i32.add
                local.get 3
                i32.const 36
                i32.add
                i32.load
                i32.store
                local.get 3
                local.get 3
                i64.load offset=28 align=4
                i64.store offset=80
                i32.const 1052700
                i32.const 28
                local.get 3
                i32.const 80
                i32.add
                i32.const 1052684
                i32.const 1052756
                call 12
                unreachable
              end
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i32.const 80
              i32.add
              local.set 6
              local.get 3
              i32.const 24
              i32.add
              local.set 2
            end
            local.get 5
            i32.const 4
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 2
              local.get 6
              call 64
              i32.const 4
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i32.const 56
              i32.add
              local.get 3
              i32.const 24
              i32.add
              i32.const 1048684
              call 11
              local.get 3
              i32.load offset=56
              local.tee 2
              local.get 3
              i32.load offset=64
              local.tee 6
              call 9
              i32.eqz
              br_if 2 (;@3;)
              local.get 3
              i32.const 80
              i32.add
              local.set 4
            end
            local.get 5
            i32.const 5
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 4
              local.get 2
              local.get 6
              i32.const 1048705
              i32.const 28
              call 65
              i32.const 5
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i32.const 24
              i32.add
              local.get 3
              i32.const 80
              i32.add
              local.tee 6
              call 66
              local.get 3
              i32.const 24
              i32.add
              i32.const 1048736
              call 14
              local.set 7
              local.get 3
              i32.const 80
              i32.add
              call 67
              i32.const 1
              local.set 4
              br 2 (;@3;)
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            local.get 7
            i32.store8 offset=25
            local.get 3
            i32.const 80
            i32.add
            call 8
            local.get 3
            i32.load8_u offset=25
            local.set 1
          end
          local.get 5
          i32.const 6
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 3
            call 59
            i32.const 6
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 2
          local.get 3
          i32.const 80
          i32.add
          global.get 3
          select
          local.set 2
          local.get 5
          i32.const 7
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 2
            i32.const 1048791
            i32.const 48
            call 60
            i32.const 7
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            call 4
            local.get 3
            i32.const 8
            i32.add
            local.tee 2
            local.get 3
            i32.const 88
            i32.add
            local.tee 6
            i32.load
            i32.store
            local.get 3
            local.get 3
            i64.load offset=80
            local.tee 8
            i64.store
            local.get 3
            i32.const 44
            i32.add
            local.get 3
            i32.const 16
            i32.add
            local.tee 7
            i64.load
            i64.store align=4
            local.get 3
            i32.const 36
            i32.add
            local.tee 4
            local.get 2
            i64.load
            i64.store align=4
            local.get 3
            local.get 8
            i64.store offset=28 align=4
            local.get 3
            i32.const 0
            i32.store offset=24
            local.get 3
            i32.const 24
            i32.add
            i32.const 4
            i32.or
            local.set 2
          end
          local.get 5
          i32.const 8
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 2
            i32.const 1048889
            i32.const 15
            i32.const 1048904
            i32.const 14
            call 65
            i32.const 8
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            i32.const 24
            i32.add
            local.get 1
            call 68
            local.get 2
            call 67
            local.get 3
            i32.load offset=24
            local.set 4
          end
          local.get 5
          i32.const 9
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            local.get 4
            call 16
            i32.const 9
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 4
          local.get 3
          i32.const 56
          i32.add
          global.get 3
          select
          local.set 4
          local.get 5
          i32.const 10
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 4
            call 59
            i32.const 10
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 4
          local.get 3
          i32.const 80
          i32.add
          global.get 3
          select
          local.set 4
          local.get 5
          i32.const 11
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 4
            i32.const 1048839
            i32.const 50
            call 60
            i32.const 11
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            i32.const 56
            i32.add
            call 4
            local.get 3
            i32.const -64
            i32.sub
            local.tee 4
            local.get 6
            i32.load
            i32.store
            local.get 3
            local.get 3
            i64.load offset=80
            local.tee 8
            i64.store offset=56
            local.get 0
            i32.load offset=8
            local.set 6
            local.get 0
            i32.load
            local.set 7
            local.get 3
            i32.const 168
            i32.add
            local.get 3
            i32.const 72
            i32.add
            i64.load
            i64.store
            local.get 3
            i32.const 160
            i32.add
            local.get 4
            i64.load
            i64.store
            local.get 3
            local.get 8
            i64.store offset=152
            local.get 3
            i32.const 152
            i32.add
            local.set 4
            local.get 3
            i32.const 80
            i32.add
            local.set 0
          end
          local.get 5
          i32.const 12
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            local.get 7
            local.get 6
            local.get 4
            call 69
            i32.const 12
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 0
          local.get 3
          i32.const 80
          i32.add
          global.get 3
          select
          local.set 0
          local.get 5
          i32.const 13
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            i32.const 1048889
            i32.const 15
            i32.const 1048904
            i32.const 14
            call 65
            i32.const 13
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            i32.const 80
            i32.add
            local.get 1
            call 70
            local.get 3
            i32.const 80
            i32.add
            call 67
            local.get 3
            i32.const 80
            i32.add
            call 8
            local.get 2
            call 5
            local.get 3
            i32.const 176
            i32.add
            global.set 0
            return
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 1
          i32.const 1
          i32.sub
          local.set 1
          local.get 3
          i32.const 56
          i32.add
          local.tee 2
          call 4
          br 1 (;@2;)
        end
      end
      return
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 4
    i32.store offset=16
    local.get 5
    local.get 6
    i32.store offset=20
    local.get 5
    local.get 7
    i32.store offset=24
    global.get 4
    global.get 4
    i32.load
    i32.const 28
    i32.add
    i32.store)
  (func (;59;) (type 3) (param i32)
    (local i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 4
      i32.sub
      i32.store
      global.get 4
      i32.load
      i32.load
      local.set 0
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if (result i32)  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
      else
        local.get 1
      end
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 0
        i32.const 1053624
        i32.const 27
        call 60
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.const 16
        i32.add
        i64.const 0
        i64.store align=4
        local.get 0
        i32.const 1053616
        i32.load
        i32.store offset=12
      end
      return
    end
    local.set 1
    global.get 4
    i32.load
    local.get 1
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.get 0
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store)
  (func (;60;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 8
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 2
      i32.load
      local.set 0
      local.get 2
      i32.load offset=4
      local.set 2
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 4
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 16
        i32.sub
        local.tee 3
        global.set 0
        block  ;; label = @3
          local.get 2
          i32.const 0
          i32.ge_s
          if  ;; label = @4
            local.get 3
            i32.const 8
            i32.add
            local.get 2
            call 82
            local.get 3
            i32.load offset=8
            local.tee 5
            i32.eqz
            br_if 1 (;@3;)
            local.get 3
            i32.load offset=12
            local.set 4
            local.get 0
            local.get 5
            i32.store
            local.get 0
            local.get 4
            i32.store offset=4
            local.get 5
            local.get 1
            local.get 2
            call 85
            drop
            local.get 0
            local.get 2
            i32.store offset=8
            local.get 3
            i32.const 16
            i32.add
            global.set 0
            return
          end
          call 25
          unreachable
        end
        i32.const 1054048
        i32.load
        local.tee 3
        i32.const 3
        local.get 3
        select
        local.set 0
      end
      local.get 4
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 2
        i32.const 1
        local.get 0
        call_indirect (type 1)
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        unreachable
      end
      return
    end
    local.set 1
    global.get 4
    i32.load
    local.get 1
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 1
    local.get 0
    i32.store
    local.get 1
    local.get 2
    i32.store offset=4
    global.get 4
    global.get 4
    i32.load
    i32.const 8
    i32.add
    i32.store)
  (func (;61;) (type 5) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 36
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 6
      i32.load
      local.set 0
      local.get 6
      i32.load offset=4
      local.set 1
      local.get 6
      i32.load offset=8
      local.set 2
      local.get 6
      i32.load offset=12
      local.set 3
      local.get 6
      i32.load offset=16
      local.set 4
      local.get 6
      i32.load offset=20
      local.set 7
      local.get 6
      i32.load offset=24
      local.set 8
      local.get 6
      i32.load offset=28
      local.set 9
      local.get 6
      i32.load offset=32
      local.set 6
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 112
        i32.sub
        local.tee 4
        global.set 0
        local.get 3
        i32.load
        local.set 8
        local.get 4
        i32.const 8
        i32.add
        local.set 7
        local.get 3
        i32.const 8
        i32.add
        local.tee 9
        i32.load
        local.set 6
      end
      local.get 5
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 7
        local.get 8
        local.get 6
        call 36
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i32.const 12
        i32.add
        local.set 8
        local.get 4
        i32.const 20
        i32.add
        local.set 7
      end
      local.get 5
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 7
        local.get 8
        call 75
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.const 104
        i32.add
        local.get 3
        i32.const 16
        i32.add
        i64.load align=4
        i64.store
        local.get 4
        i32.const 96
        i32.add
        local.tee 7
        local.get 9
        i64.load align=4
        i64.store
        local.get 4
        local.get 3
        i64.load align=4
        i64.store offset=88
        local.get 4
        i32.const 88
        i32.add
        local.set 9
        local.get 4
        i32.const 32
        i32.add
        local.set 3
      end
      local.get 5
      i32.const 2
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 3
        local.get 1
        local.get 2
        local.get 9
        call 76
        i32.const 2
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.load offset=32
        i32.const 1
        i32.eq
        if  ;; label = @3
          local.get 7
          local.get 4
          i32.const 44
          i32.add
          i32.load
          i32.store
          local.get 4
          local.get 4
          i64.load offset=36 align=4
          i64.store offset=88
          i32.const 1052883
          i32.const 30
          local.get 4
          i32.const 88
          i32.add
          i32.const 1052824
          i32.const 1052976
          call 12
          unreachable
        end
        local.get 0
        i32.const 24
        i32.add
        local.get 4
        i32.const 32
        i32.add
        i32.const 4
        i32.or
        i32.const 48
        call 85
        drop
        local.get 0
        i32.const 16
        i32.add
        local.get 4
        i32.const 24
        i32.add
        i64.load
        i64.store align=4
        local.get 0
        i32.const 8
        i32.add
        local.get 4
        i32.const 16
        i32.add
        i64.load
        i64.store align=4
        local.get 0
        local.get 4
        i64.load offset=8
        i64.store align=4
        local.get 4
        i32.const 112
        i32.add
        global.set 0
      end
      return
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 4
    i32.store offset=16
    local.get 5
    local.get 7
    i32.store offset=20
    local.get 5
    local.get 8
    i32.store offset=24
    local.get 5
    local.get 9
    i32.store offset=28
    local.get 5
    local.get 6
    i32.store offset=32
    global.get 4
    global.get 4
    i32.load
    i32.const 36
    i32.add
    i32.store)
  (func (;62;) (type 1) (param i32 i32)
    (local i32)
    local.get 0
    i32.const 0
    i32.store
    local.get 1
    i32.const 44
    i32.add
    local.tee 2
    local.get 2
    i32.load
    local.tee 2
    i32.const 3
    i32.add
    i32.store
    local.get 2
    local.get 1
    i32.load offset=24
    i32.add
    i32.const 1
    i32.add
    local.tee 1
    i32.const 8
    i32.shl
    local.set 2
    local.get 0
    local.get 2
    local.get 1
    i32.const 65280
    i32.and
    i32.const 8
    i32.shr_u
    i32.or
    i32.const 65535
    i32.and
    i32.store offset=4)
  (func (;63;) (type 5) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 44
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 7
      i32.load
      local.set 0
      local.get 7
      i32.load offset=4
      local.set 1
      local.get 7
      i32.load offset=8
      local.set 2
      local.get 7
      i32.load offset=12
      local.set 3
      local.get 7
      i32.load offset=16
      local.set 4
      local.get 7
      i32.load offset=20
      local.set 6
      local.get 7
      i32.load offset=24
      local.set 8
      local.get 7
      i32.load offset=28
      local.set 9
      local.get 7
      i32.load offset=32
      local.set 10
      local.get 7
      i32.load offset=36
      local.set 11
      local.get 7
      i32.load offset=40
      local.set 7
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 128
        i32.sub
        local.tee 4
        global.set 0
        local.get 4
        i32.const 124
        i32.add
        local.tee 6
        i32.const 2
        i32.store
        local.get 4
        i32.const 116
        i32.add
        local.tee 8
        i32.const 1
        i32.store
        local.get 4
        i32.const 92
        i32.add
        local.tee 10
        i32.const 4
        i32.store
        local.get 4
        i32.const 1053812
        i32.store offset=112
        local.get 4
        i32.const 1
        i32.store offset=108
        local.get 4
        i32.const 1053792
        i32.store offset=104
        local.get 4
        i32.const 8
        i32.store offset=84
        local.get 4
        i32.const 1053804
        i32.store offset=80
        local.get 4
        local.get 4
        i32.const 80
        i32.add
        i32.store offset=120
        local.get 4
        local.get 4
        i32.const -64
        i32.sub
        i32.store offset=88
        local.get 4
        i32.const 0
        i32.store offset=64
        local.get 4
        i32.const 104
        i32.add
        local.set 9
      end
      local.get 5
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 4
        local.get 9
        call 30
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 6
        i32.const 2
        i32.store
        local.get 8
        i32.const 1
        i32.store
        local.get 10
        i32.const 4
        i32.store
        local.get 4
        i32.const 1053812
        i32.store offset=112
        local.get 4
        i32.const 1
        i32.store offset=108
        local.get 4
        i32.const 1053844
        i32.store offset=104
        local.get 4
        i32.const 8
        i32.store offset=84
        local.get 4
        i32.const 1053804
        i32.store offset=80
        local.get 4
        i32.const 1
        i32.store offset=64
        local.get 4
        local.get 4
        i32.const 80
        i32.add
        i32.store offset=120
        local.get 4
        local.get 4
        i32.const -64
        i32.sub
        i32.store offset=88
        local.get 4
        i32.const 104
        i32.add
        local.set 10
        local.get 4
        i32.const 16
        i32.add
        local.set 6
      end
      local.get 5
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        local.get 10
        call 30
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i64.const 0
        i64.store offset=36 align=4
        local.get 4
        i32.const 1053996
        i32.load
        i32.store offset=32
        local.get 4
        i32.load
        local.set 10
        local.get 4
        i32.load offset=8
        local.set 9
        local.get 4
        i32.const 32
        i32.add
        local.set 6
      end
      local.get 5
      i32.const 2
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        local.get 10
        local.get 9
        call 78
        i32.const 2
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 8
        local.get 1
        i32.load offset=8
        i32.store
        local.get 4
        i32.const 9
        i32.store offset=108
        local.get 4
        i32.const 1053852
        i32.store offset=104
        local.get 4
        local.get 1
        i32.load
        i32.store offset=112
        local.get 4
        i32.const 48
        i32.add
        local.set 8
        local.get 4
        i32.const 104
        i32.add
        local.set 6
      end
      local.get 5
      i32.const 3
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 8
        local.get 6
        i32.const 2
        call 77
        i32.const 3
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.load offset=56
        local.set 10
        local.get 4
        i32.const 32
        i32.add
        local.set 8
        local.get 4
        i32.load offset=48
        local.set 6
      end
      local.get 5
      i32.const 4
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 8
        local.get 6
        local.get 10
        call 78
        i32.const 4
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 1
        i32.const 20
        i32.add
        i32.load
        local.tee 8
        i32.eqz
        local.set 6
      end
      block  ;; label = @2
        block  ;; label = @3
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 6
            br_if 1 (;@3;)
            local.get 4
            i32.load offset=24
            local.set 6
            local.get 4
            i32.load offset=16
            local.set 10
            local.get 1
            i32.load offset=12
            local.get 8
            i32.const 36
            i32.mul
            i32.add
            i32.const 12
            i32.sub
            local.set 1
          end
          loop  ;; label = @4
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 8
              i32.eqz
              if  ;; label = @6
                local.get 4
                i32.const 88
                i32.add
                local.get 4
                i32.const 40
                i32.add
                i32.load
                i32.store
                local.get 4
                local.get 4
                i64.load offset=32
                i64.store offset=80
                local.get 4
                i32.const 48
                i32.add
                call 4
                local.get 4
                i32.const 16
                i32.add
                local.tee 1
                call 4
                br 4 (;@2;)
              end
              local.get 4
              i32.const 32
              i32.add
              local.set 9
            end
            local.get 5
            i32.const 5
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 9
              local.get 10
              local.get 6
              call 78
              i32.const 5
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 4
              i32.const 3
              i32.store offset=100
              local.get 4
              i64.const 3
              i64.store offset=84 align=4
              local.get 4
              i32.const 1053896
              i32.store offset=80
              local.get 4
              i32.const 9
              i32.store offset=124
              local.get 4
              i32.const 9
              i32.store offset=116
              local.get 4
              i32.const 9
              i32.store offset=108
              local.get 4
              local.get 1
              i32.store offset=120
              local.get 4
              local.get 1
              i32.const 12
              i32.sub
              i32.store offset=112
              local.get 4
              local.get 1
              i32.const 24
              i32.sub
              i32.store offset=104
              local.get 4
              local.get 4
              i32.const 104
              i32.add
              i32.store offset=96
              local.get 4
              i32.const 80
              i32.add
              local.set 11
              local.get 4
              i32.const -64
              i32.sub
              local.set 9
            end
            local.get 5
            i32.const 6
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 9
              local.get 11
              call 30
              i32.const 6
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 4
              i32.load offset=64
              local.set 11
              local.get 4
              i32.const 32
              i32.add
              local.set 9
              local.get 4
              i32.load offset=72
              local.set 7
            end
            local.get 5
            i32.const 7
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 9
              local.get 11
              local.get 7
              call 78
              i32.const 7
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 8
              i32.const 1
              i32.sub
              local.set 8
              local.get 1
              i32.const 36
              i32.sub
              local.set 1
              local.get 4
              i32.const -64
              i32.sub
              local.tee 9
              call 4
              br 1 (;@4;)
            end
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 4
          i32.load offset=16
          local.set 8
          local.get 4
          i32.load offset=24
          local.set 6
          local.get 4
          i32.const 32
          i32.add
          local.set 1
        end
        local.get 5
        i32.const 8
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 1
          local.get 8
          local.get 6
          call 78
          i32.const 8
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        local.get 1
        local.get 4
        i32.const 32
        i32.add
        global.get 3
        select
        local.set 1
        local.get 5
        i32.const 9
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 1
          i32.const 1053861
          i32.const 22
          call 78
          i32.const 9
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 4
          i32.const 88
          i32.add
          local.get 4
          i32.const 40
          i32.add
          i32.load
          i32.store
          local.get 4
          local.get 4
          i64.load offset=32
          i64.store offset=80
          local.get 4
          i32.const 48
          i32.add
          call 4
          local.get 4
          i32.const 16
          i32.add
          local.tee 1
          call 4
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        call 4
        local.get 4
        i32.const 124
        i32.add
        local.get 4
        i32.load offset=88
        i32.store
        local.get 4
        i32.const 116
        i32.add
        i32.const 1
        i32.store
        local.get 4
        local.get 4
        i32.load offset=80
        i32.store offset=120
        local.get 4
        i32.const 1053788
        i32.store offset=112
        local.get 4
        local.get 3
        i32.store offset=108
        local.get 4
        local.get 2
        i32.store offset=104
        local.get 4
        i32.const 104
        i32.add
        local.set 1
      end
      local.get 5
      i32.const 10
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 0
        local.get 1
        i32.const 3
        call 77
        i32.const 10
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.const 80
        i32.add
        call 4
        local.get 4
        i32.const 128
        i32.add
        global.set 0
      end
      return
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 4
    i32.store offset=16
    local.get 5
    local.get 6
    i32.store offset=20
    local.get 5
    local.get 8
    i32.store offset=24
    local.get 5
    local.get 9
    i32.store offset=28
    local.get 5
    local.get 10
    i32.store offset=32
    local.get 5
    local.get 11
    i32.store offset=36
    local.get 5
    local.get 7
    i32.store offset=40
    global.get 4
    global.get 4
    i32.load
    i32.const 44
    i32.add
    i32.store)
  (func (;64;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32 i64)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 12
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 4
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 16
        i32.sub
        local.tee 3
        global.set 0
        local.get 1
        i32.const 44
        i32.add
        local.tee 2
        local.get 2
        i32.load
        i32.const 2
        i32.add
        local.tee 2
        i32.store
        local.get 2
        local.get 1
        i32.const 36
        i32.add
        i32.load
        local.tee 5
        i32.gt_u
        if  ;; label = @3
          local.get 2
          local.get 5
          i32.const 1053188
          call 46
          unreachable
        end
        local.get 1
        local.get 2
        i32.store offset=44
        local.get 3
        i32.const 8
        i32.add
        local.set 1
      end
      local.get 4
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 1
        i32.const 0
        call 17
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i64.load offset=8
        local.set 6
        local.get 0
        i32.const 12
        i32.add
        i32.const 0
        i32.store
        local.get 0
        i32.const 0
        i32.store
        local.get 0
        local.get 6
        i64.store offset=4 align=4
        local.get 3
        i32.const 16
        i32.add
        global.set 0
      end
      return
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 3
    i32.store offset=8
    global.get 4
    global.get 4
    i32.load
    i32.const 12
    i32.add
    i32.store)
  (func (;65;) (type 7) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 28
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 8
      i32.load
      local.set 0
      local.get 8
      i32.load offset=4
      local.set 1
      local.get 8
      i32.load offset=8
      local.set 2
      local.get 8
      i32.load offset=12
      local.set 3
      local.get 8
      i32.load offset=16
      local.set 4
      local.get 8
      i32.load offset=20
      local.set 10
      local.get 8
      i32.load offset=24
      local.set 8
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 48
        i32.sub
        local.tee 10
        global.set 0
        local.get 10
        i32.const 8
        i32.add
        local.set 8
      end
      local.get 5
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 8
        local.get 1
        local.get 2
        call 60
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      local.get 1
      local.get 10
      i32.const 20
      i32.add
      global.get 3
      select
      local.set 1
      local.get 5
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 1
        i32.const 1048703
        i32.const 2
        call 60
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      local.get 1
      local.get 10
      i32.const 32
      i32.add
      global.get 3
      select
      local.set 1
      local.get 5
      i32.const 2
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 1
        local.get 3
        local.get 4
        call 60
        i32.const 2
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.const 20
        i32.add
        i32.load
        local.tee 3
        local.get 0
        i32.const 16
        i32.add
        i32.load
        i32.ne
        local.set 1
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 1
          br_if 1 (;@2;)
          local.get 0
          i32.const 12
          i32.add
          local.set 1
        end
        local.get 5
        i32.const 3
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 1
          local.set 9
          local.get 3
          local.set 5
          global.get 3
          i32.const 2
          i32.eq
          if  ;; label = @4
            global.get 4
            global.get 4
            i32.load
            i32.const 12
            i32.sub
            i32.store
            global.get 4
            i32.load
            local.tee 6
            i32.load
            local.set 9
            local.get 6
            i32.load offset=4
            local.set 5
            local.get 6
            i32.load offset=8
            local.set 6
          end
          block  ;; label = @4
            block (result i32)  ;; label = @5
              global.get 3
              i32.const 2
              i32.eq
              if  ;; label = @6
                global.get 4
                global.get 4
                i32.load
                i32.const 4
                i32.sub
                i32.store
                global.get 4
                i32.load
                i32.load
                local.set 16
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                global.get 0
                i32.const 16
                i32.sub
                local.tee 6
                global.set 0
                local.get 5
                i32.const 1
                i32.add
                local.tee 7
                local.get 5
                i32.lt_u
                local.set 5
              end
              block  ;; label = @6
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 5
                  br_if 1 (;@6;)
                  local.get 9
                  i32.load offset=4
                  local.tee 5
                  i32.const 1
                  i32.shl
                  local.tee 11
                  local.get 7
                  i32.gt_u
                  local.set 12
                  local.get 11
                  local.get 7
                  local.get 12
                  select
                  local.tee 7
                  i32.const 4
                  i32.gt_u
                  local.set 11
                  local.get 6
                  local.set 12
                  local.get 7
                  i32.const 4
                  local.get 11
                  select
                  i64.extend_i32_u
                  i64.const 36
                  i64.mul
                  local.tee 17
                  i32.wrap_i64
                  local.set 7
                  local.get 9
                  i32.load
                  i32.const 0
                  local.get 5
                  select
                  local.set 14
                  local.get 5
                  i32.const 36
                  i32.mul
                  local.set 18
                  i32.const 0
                  local.set 5
                  global.get 0
                  i32.const 16
                  i32.sub
                  local.tee 13
                  global.set 0
                  block  ;; label = @8
                    block (result i32)  ;; label = @9
                      block  ;; label = @10
                        local.get 17
                        i64.const 32
                        i64.shr_u
                        i64.eqz
                        i32.const 2
                        i32.shl
                        local.tee 11
                        if  ;; label = @11
                          i32.const 1
                          local.set 15
                          local.get 7
                          i32.const 0
                          i32.lt_s
                          br_if 3 (;@8;)
                          local.get 14
                          br_if 1 (;@10;)
                          local.get 13
                          local.get 7
                          local.get 11
                          call 74
                          local.get 13
                          i32.load offset=4
                          local.set 5
                          local.get 13
                          i32.load
                          br 2 (;@9;)
                        end
                        local.get 12
                        local.get 7
                        i32.store offset=4
                        i32.const 1
                        local.set 15
                        br 2 (;@8;)
                      end
                      local.get 18
                      i32.eqz
                      if  ;; label = @10
                        local.get 13
                        i32.const 8
                        i32.add
                        local.get 7
                        local.get 11
                        call 74
                        local.get 13
                        i32.load offset=12
                        local.set 5
                        local.get 13
                        i32.load offset=8
                        br 1 (;@9;)
                      end
                      local.get 14
                      local.get 7
                      local.tee 5
                      call 22
                    end
                    local.tee 14
                    if  ;; label = @9
                      local.get 12
                      local.get 14
                      i32.store offset=4
                      i32.const 0
                      local.set 15
                      br 1 (;@8;)
                    end
                    local.get 12
                    local.get 7
                    i32.store offset=4
                    local.get 11
                    local.set 5
                  end
                  local.get 12
                  local.get 15
                  i32.store
                  local.get 12
                  i32.const 8
                  i32.add
                  local.get 5
                  i32.store
                  local.get 13
                  i32.const 16
                  i32.add
                  global.set 0
                  local.get 6
                  i32.load
                  i32.const 1
                  i32.ne
                  local.set 5
                end
                block  ;; label = @7
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    local.get 5
                    br_if 1 (;@7;)
                    local.get 6
                    i32.const 8
                    i32.add
                    i32.load
                    local.tee 9
                    i32.eqz
                    br_if 2 (;@6;)
                    local.get 6
                    i32.load offset=4
                    local.set 5
                    i32.const 1054048
                    i32.load
                    local.tee 6
                    i32.const 3
                    local.get 6
                    select
                    local.set 6
                  end
                  local.get 16
                  i32.eqz
                  i32.const 1
                  global.get 3
                  select
                  if  ;; label = @8
                    local.get 5
                    local.get 9
                    local.get 6
                    call_indirect (type 1)
                    i32.const 0
                    global.get 3
                    i32.const 1
                    i32.eq
                    br_if 3 (;@5;)
                    drop
                  end
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    unreachable
                  end
                end
                global.get 3
                i32.eqz
                if  ;; label = @7
                  local.get 6
                  i32.load offset=4
                  local.set 5
                  local.get 9
                  local.get 6
                  i32.const 8
                  i32.add
                  i32.load
                  i32.const 36
                  i32.div_u
                  i32.store offset=4
                  local.get 9
                  local.get 5
                  i32.store
                  local.get 6
                  i32.const 16
                  i32.add
                  global.set 0
                  br 3 (;@4;)
                end
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                call 25
                unreachable
              end
              br 1 (;@4;)
            end
            local.set 7
            global.get 4
            i32.load
            local.get 7
            i32.store
            global.get 4
            global.get 4
            i32.load
            i32.const 4
            i32.add
            i32.store
            global.get 4
            i32.load
            local.tee 7
            local.get 9
            i32.store
            local.get 7
            local.get 5
            i32.store offset=4
            local.get 7
            local.get 6
            i32.store offset=8
            global.get 4
            global.get 4
            i32.load
            i32.const 12
            i32.add
            i32.store
          end
          i32.const 3
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.load offset=20
          local.set 3
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load offset=12
        local.get 3
        i32.const 36
        i32.mul
        i32.add
        local.get 10
        i32.const 8
        i32.add
        i32.const 36
        call 85
        drop
        local.get 0
        local.get 3
        i32.const 1
        i32.add
        i32.store offset=20
        local.get 10
        i32.const 48
        i32.add
        global.set 0
      end
      return
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 4
    i32.store offset=16
    local.get 5
    local.get 10
    i32.store offset=20
    local.get 5
    local.get 8
    i32.store offset=24
    global.get 4
    global.get 4
    i32.load
    i32.const 28
    i32.add
    i32.store)
  (func (;66;) (type 1) (param i32 i32)
    local.get 0
    i32.const 0
    i32.store16
    local.get 1
    i32.const 44
    i32.add
    local.tee 1
    i32.load
    i32.const 2
    i32.add
    local.set 0
    local.get 1
    local.get 0
    i32.store)
  (func (;67;) (type 3) (param i32)
    (local i32 i32)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 1
    global.set 0
    local.get 0
    i32.const 20
    i32.add
    i32.load
    local.tee 2
    if  ;; label = @1
      local.get 0
      local.get 2
      i32.const 1
      i32.sub
      local.tee 2
      i32.store offset=20
      local.get 1
      i32.const 8
      i32.add
      local.get 0
      i32.load offset=12
      local.get 2
      i32.const 36
      i32.mul
      i32.add
      i32.const 36
      call 85
      drop
      local.get 1
      i32.load offset=8
      if  ;; label = @2
        local.get 1
        i32.const 8
        i32.add
        call 4
        local.get 1
        i32.const 20
        i32.add
        call 4
        local.get 1
        i32.const 32
        i32.add
        call 4
      end
      local.get 1
      i32.const 48
      i32.add
      global.set 0
      return
    end
    local.get 1
    i32.const 28
    i32.add
    i32.const 0
    i32.store
    local.get 1
    i32.const 1053952
    i32.store offset=24
    local.get 1
    i64.const 1
    i64.store offset=12 align=4
    local.get 1
    i32.const 1053708
    i32.store offset=8
    local.get 1
    i32.const 8
    i32.add
    i32.const 1053772
    call 40
    unreachable)
  (func (;68;) (type 1) (param i32 i32)
    local.get 0
    local.get 0
    i32.load
    i32.const 1
    i32.const 2
    local.get 1
    i32.const 24
    i32.shl
    i32.const 24
    i32.shr_s
    i32.const -1
    i32.gt_s
    select
    i32.add
    i32.store)
  (func (;69;) (type 5) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 36
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 6
      i32.load
      local.set 0
      local.get 6
      i32.load offset=4
      local.set 1
      local.get 6
      i32.load offset=8
      local.set 2
      local.get 6
      i32.load offset=12
      local.set 3
      local.get 6
      i32.load offset=16
      local.set 4
      local.get 6
      i32.load offset=20
      local.set 7
      local.get 6
      i32.load offset=24
      local.set 8
      local.get 6
      i32.load offset=28
      local.set 9
      local.get 6
      i32.load offset=32
      local.set 6
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 112
        i32.sub
        local.tee 4
        global.set 0
        local.get 3
        i32.load
        local.set 8
        local.get 4
        i32.const 8
        i32.add
        local.set 7
        local.get 3
        i32.const 8
        i32.add
        local.tee 9
        i32.load
        local.set 6
      end
      local.get 5
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 7
        local.get 8
        local.get 6
        call 36
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i32.const 12
        i32.add
        local.set 8
        local.get 4
        i32.const 20
        i32.add
        local.set 7
      end
      local.get 5
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 7
        local.get 8
        call 75
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.const 104
        i32.add
        local.get 3
        i32.const 16
        i32.add
        i64.load align=4
        i64.store
        local.get 4
        i32.const 96
        i32.add
        local.tee 7
        local.get 9
        i64.load align=4
        i64.store
        local.get 4
        local.get 3
        i64.load align=4
        i64.store offset=88
        local.get 4
        i32.const 88
        i32.add
        local.set 9
        local.get 4
        i32.const 32
        i32.add
        local.set 3
      end
      local.get 5
      i32.const 2
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 3
        local.get 1
        local.get 2
        local.get 9
        call 76
        i32.const 2
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.load offset=32
        i32.const 1
        i32.eq
        if  ;; label = @3
          local.get 7
          local.get 4
          i32.const 44
          i32.add
          i32.load
          i32.store
          local.get 4
          local.get 4
          i64.load offset=36 align=4
          i64.store offset=88
          i32.const 1053220
          i32.const 28
          local.get 4
          i32.const 88
          i32.add
          i32.const 1053204
          i32.const 1053312
          call 12
          unreachable
        end
        local.get 0
        i32.const 24
        i32.add
        local.get 4
        i32.const 32
        i32.add
        i32.const 4
        i32.or
        i32.const 48
        call 85
        drop
        local.get 0
        i32.const 16
        i32.add
        local.get 4
        i32.const 24
        i32.add
        i64.load
        i64.store align=4
        local.get 0
        i32.const 8
        i32.add
        local.get 4
        i32.const 16
        i32.add
        i64.load
        i64.store align=4
        local.get 0
        local.get 4
        i64.load offset=8
        i64.store align=4
        local.get 4
        i32.const 112
        i32.add
        global.set 0
      end
      return
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 4
    i32.store offset=16
    local.get 5
    local.get 7
    i32.store offset=20
    local.get 5
    local.get 8
    i32.store offset=24
    local.get 5
    local.get 9
    i32.store offset=28
    local.get 5
    local.get 6
    i32.store offset=32
    global.get 4
    global.get 4
    i32.load
    i32.const 36
    i32.add
    i32.store)
  (func (;70;) (type 1) (param i32 i32)
    local.get 0
    i32.const 44
    i32.add
    local.tee 0
    i32.load
    i32.const 1
    i32.const 2
    local.get 1
    i32.const 24
    i32.shl
    i32.const 24
    i32.shr_s
    i32.const -1
    i32.gt_s
    select
    i32.add
    local.set 1
    local.get 0
    local.get 1
    i32.store)
  (func (;71;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i64)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 28
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 7
      i32.load
      local.set 0
      local.get 7
      i32.load offset=4
      local.set 1
      local.get 7
      i32.load offset=8
      local.set 2
      local.get 7
      i32.load offset=12
      local.set 3
      local.get 7
      i32.load offset=16
      local.set 4
      local.get 7
      i32.load offset=20
      local.set 6
      local.get 7
      i32.load offset=24
      local.set 7
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 176
        i32.sub
        local.tee 3
        global.set 0
        local.get 3
        i32.const 152
        i32.add
        local.set 6
      end
      local.get 5
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        call 59
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      local.get 6
      local.get 3
      i32.const 80
      i32.add
      global.get 3
      select
      local.set 6
      local.get 5
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        i32.const 1048918
        i32.const 50
        call 60
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i32.const 152
        i32.add
        call 4
        local.get 3
        i32.const 160
        i32.add
        local.tee 6
        local.get 3
        i32.const 88
        i32.add
        i32.load
        i32.store
        local.get 3
        local.get 3
        i64.load offset=80
        local.tee 8
        i64.store offset=152
        local.get 3
        i32.const 40
        i32.add
        local.get 3
        i32.const 168
        i32.add
        local.tee 7
        i64.load
        i64.store
        local.get 3
        i32.const 32
        i32.add
        local.get 6
        i64.load
        i64.store
        local.get 3
        local.get 8
        i64.store offset=24
        local.get 3
        i32.const 80
        i32.add
        local.set 6
        local.get 3
        i32.const 24
        i32.add
        local.set 4
      end
      local.get 5
      i32.const 2
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        local.get 1
        local.get 2
        local.get 4
        call 61
        i32.const 2
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 3
        i32.const 24
        i32.add
        local.get 3
        i32.const 80
        i32.add
        local.tee 2
        call 62
        i32.const 0
        local.set 4
        i32.const 0
        local.set 7
        local.get 3
        i32.const 24
        i32.add
        i32.const 1048968
        call 13
        local.set 1
      end
      loop  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 1
                br_if 1 (;@5;)
                local.get 4
                i32.const 1
                i32.and
                local.tee 1
                br_if 2 (;@4;)
                local.get 3
                i32.const 80
                i32.add
                local.set 1
                local.get 3
                i32.const 24
                i32.add
                i32.const 4
                i32.or
                local.set 0
              end
              local.get 5
              i32.const 3
              i32.eq
              i32.const 1
              global.get 3
              select
              if  ;; label = @6
                local.get 0
                local.get 1
                i32.const 1048752
                i32.const 39
                call 63
                i32.const 3
                global.get 3
                i32.const 1
                i32.eq
                br_if 5 (;@1;)
                drop
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                local.get 3
                i32.const 80
                i32.add
                call 8
                local.get 3
                i32.const 88
                i32.add
                local.get 3
                i32.const 36
                i32.add
                i32.load
                i32.store
                local.get 3
                local.get 3
                i64.load offset=28 align=4
                i64.store offset=80
                i32.const 1052700
                i32.const 28
                local.get 3
                i32.const 80
                i32.add
                i32.const 1052684
                i32.const 1052772
                call 12
                unreachable
              end
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i32.const 80
              i32.add
              local.set 6
              local.get 3
              i32.const 24
              i32.add
              local.set 2
            end
            local.get 5
            i32.const 4
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 2
              local.get 6
              call 64
              i32.const 4
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i32.const 56
              i32.add
              local.get 3
              i32.const 24
              i32.add
              i32.const 1048984
              call 11
              local.get 3
              i32.load offset=56
              local.tee 2
              local.get 3
              i32.load offset=64
              local.tee 6
              call 9
              i32.eqz
              br_if 2 (;@3;)
              local.get 3
              i32.const 80
              i32.add
              local.set 4
            end
            local.get 5
            i32.const 5
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 4
              local.get 2
              local.get 6
              i32.const 1048705
              i32.const 28
              call 65
              i32.const 5
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 3
              i32.const 24
              i32.add
              local.get 3
              i32.const 80
              i32.add
              local.tee 6
              call 66
              local.get 3
              i32.const 24
              i32.add
              i32.const 1049000
              call 14
              local.set 7
              local.get 3
              i32.const 80
              i32.add
              call 67
              i32.const 1
              local.set 4
              br 2 (;@3;)
            end
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            local.get 7
            i32.store8 offset=25
            local.get 3
            i32.const 80
            i32.add
            call 8
            local.get 3
            i32.load8_u offset=25
            local.set 1
          end
          local.get 5
          i32.const 6
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 3
            call 59
            i32.const 6
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 2
          local.get 3
          i32.const 80
          i32.add
          global.get 3
          select
          local.set 2
          local.get 5
          i32.const 7
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 2
            i32.const 1049016
            i32.const 57
            call 60
            i32.const 7
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            call 4
            local.get 3
            i32.const 8
            i32.add
            local.tee 2
            local.get 3
            i32.const 88
            i32.add
            local.tee 6
            i32.load
            i32.store
            local.get 3
            local.get 3
            i64.load offset=80
            local.tee 8
            i64.store
            local.get 3
            i32.const 44
            i32.add
            local.get 3
            i32.const 16
            i32.add
            local.tee 7
            i64.load
            i64.store align=4
            local.get 3
            i32.const 36
            i32.add
            local.tee 4
            local.get 2
            i64.load
            i64.store align=4
            local.get 3
            local.get 8
            i64.store offset=28 align=4
            local.get 3
            i32.const 0
            i32.store offset=24
            local.get 3
            i32.const 24
            i32.add
            i32.const 4
            i32.or
            local.set 2
          end
          local.get 5
          i32.const 8
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 2
            i32.const 1049132
            i32.const 24
            i32.const 1048904
            i32.const 14
            call 65
            i32.const 8
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            i32.const 24
            i32.add
            local.get 1
            call 68
            local.get 2
            call 67
            local.get 3
            i32.load offset=24
            local.set 4
          end
          local.get 5
          i32.const 9
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            local.get 4
            call 16
            i32.const 9
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 4
          local.get 3
          i32.const 56
          i32.add
          global.get 3
          select
          local.set 4
          local.get 5
          i32.const 10
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 4
            call 59
            i32.const 10
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 4
          local.get 3
          i32.const 80
          i32.add
          global.get 3
          select
          local.set 4
          local.get 5
          i32.const 11
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 4
            i32.const 1049073
            i32.const 59
            call 60
            i32.const 11
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            i32.const 56
            i32.add
            call 4
            local.get 3
            i32.const -64
            i32.sub
            local.tee 4
            local.get 6
            i32.load
            i32.store
            local.get 3
            local.get 3
            i64.load offset=80
            local.tee 8
            i64.store offset=56
            local.get 0
            i32.load offset=8
            local.set 6
            local.get 0
            i32.load
            local.set 7
            local.get 3
            i32.const 168
            i32.add
            local.get 3
            i32.const 72
            i32.add
            i64.load
            i64.store
            local.get 3
            i32.const 160
            i32.add
            local.get 4
            i64.load
            i64.store
            local.get 3
            local.get 8
            i64.store offset=152
            local.get 3
            i32.const 152
            i32.add
            local.set 4
            local.get 3
            i32.const 80
            i32.add
            local.set 0
          end
          local.get 5
          i32.const 12
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            local.get 7
            local.get 6
            local.get 4
            call 69
            i32.const 12
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          local.get 0
          local.get 3
          i32.const 80
          i32.add
          global.get 3
          select
          local.set 0
          local.get 5
          i32.const 13
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            i32.const 1049132
            i32.const 24
            i32.const 1048904
            i32.const 14
            call 65
            i32.const 13
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 3
            i32.const 80
            i32.add
            local.get 1
            call 70
            local.get 3
            i32.const 80
            i32.add
            call 67
            local.get 3
            i32.const 80
            i32.add
            call 8
            local.get 2
            call 5
            local.get 3
            i32.const 176
            i32.add
            global.set 0
            return
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 1
          i32.const 1
          i32.sub
          local.set 1
          local.get 3
          i32.const 56
          i32.add
          local.tee 2
          call 4
          br 1 (;@2;)
        end
      end
      return
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=12
    local.get 5
    local.get 4
    i32.store offset=16
    local.get 5
    local.get 6
    i32.store offset=20
    local.get 5
    local.get 7
    i32.store offset=24
    global.get 4
    global.get 4
    i32.load
    i32.const 28
    i32.add
    i32.store)
  (func (;72;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 24
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=8
      local.set 2
      local.get 3
      i32.load offset=12
      local.set 4
      local.get 3
      i32.load offset=16
      local.set 5
      local.get 3
      i32.load offset=20
      local.set 7
      local.get 3
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 6
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 48
        i32.sub
        local.tee 2
        global.set 0
        local.get 2
        i32.const 16
        i32.add
        local.set 4
      end
      local.get 6
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 4
        local.get 0
        call 17
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 2
        i32.const 8
        i32.add
        local.set 5
        local.get 2
        i32.load offset=16
        local.set 4
      end
      local.get 6
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 5
        local.get 1
        call 17
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 2
        i32.load offset=8
        local.set 5
      end
      local.get 6
      i32.const 2
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 4
        local.get 5
        call 0
        i32.const 2
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        local.get 0
        i32.const 1052788
        i32.const 14
        call 10
        local.set 7
      end
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 7
              br_if 1 (;@4;)
              local.get 4
              local.get 0
              i32.const 1052802
              i32.const 22
              call 10
              br_if 2 (;@3;)
              local.get 2
              i32.const 44
              i32.add
              local.get 1
              i32.store
              local.get 2
              i32.const 40
              i32.add
              local.get 1
              i32.store
              local.get 2
              local.get 5
              i32.store offset=36
              local.get 2
              local.get 0
              i32.store offset=32
              local.get 2
              local.get 0
              i32.store offset=28
              local.get 2
              local.get 4
              i32.store offset=24
              local.get 2
              i32.const 24
              i32.add
              local.set 0
            end
            local.get 6
            i32.const 3
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 0
              i32.const 0
              call 73
              local.set 3
              i32.const 3
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
              local.get 3
              local.set 0
            end
            global.get 3
            i32.eqz
            br_if 2 (;@2;)
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 2
            i32.const 44
            i32.add
            local.get 1
            i32.store
            local.get 2
            i32.const 40
            i32.add
            local.get 1
            i32.store
            local.get 2
            local.get 5
            i32.store offset=36
            local.get 2
            local.get 0
            i32.store offset=32
            local.get 2
            local.get 0
            i32.store offset=28
            local.get 2
            local.get 4
            i32.store offset=24
            local.get 2
            i32.const 24
            i32.add
            local.set 0
          end
          local.get 6
          i32.const 4
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 0
            i32.const 10
            call 73
            local.set 3
            i32.const 4
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
            local.get 3
            local.set 0
          end
          global.get 3
          i32.eqz
          br_if 1 (;@2;)
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 2
          i32.const 44
          i32.add
          local.get 1
          i32.store
          local.get 2
          i32.const 40
          i32.add
          local.get 1
          i32.store
          local.get 2
          local.get 5
          i32.store offset=36
          local.get 2
          local.get 0
          i32.store offset=32
          local.get 2
          local.get 0
          i32.store offset=28
          local.get 2
          local.get 4
          i32.store offset=24
          local.get 2
          i32.const 24
          i32.add
          local.set 0
        end
        local.get 6
        i32.const 5
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 0
          i32.const 11
          call 73
          local.set 3
          i32.const 5
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
          local.get 3
          local.set 0
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 2
        i32.const 48
        i32.add
        global.set 0
        local.get 0
        return
      end
      unreachable
    end
    local.set 3
    global.get 4
    i32.load
    local.get 3
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 3
    local.get 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 2
    i32.store offset=8
    local.get 3
    local.get 4
    i32.store offset=12
    local.get 3
    local.get 5
    i32.store offset=16
    local.get 3
    local.get 7
    i32.store offset=20
    global.get 4
    global.get 4
    i32.load
    i32.const 24
    i32.add
    i32.store
    i32.const 0)
  (func (;73;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 24
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 5
      i32.load
      local.set 0
      local.get 5
      i32.load offset=4
      local.set 1
      local.get 5
      i32.load offset=8
      local.set 2
      local.get 5
      i32.load offset=12
      local.set 4
      local.get 5
      i32.load offset=16
      local.set 6
      local.get 5
      i32.load offset=20
      local.set 5
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 3
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 32
        i32.sub
        local.tee 2
        global.set 0
      end
      block  ;; label = @2
        block  ;; label = @3
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 1
            br_if 1 (;@3;)
            local.get 2
            i32.const 28
            i32.add
            local.get 0
            i32.load offset=8
            local.tee 6
            i32.store
            local.get 2
            i32.const 31
            i32.store offset=20
            local.get 2
            i32.const 1053920
            i32.store offset=16
            local.get 2
            local.get 0
            i32.load
            i32.store offset=24
            local.get 2
            i32.const 16
            i32.add
            local.set 4
          end
          local.get 3
          i32.eqz
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 2
            local.get 4
            i32.const 2
            call 77
            i32.const 0
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 2
            i32.load offset=8
            local.set 6
            local.get 2
            i32.load
            local.set 4
          end
          local.get 3
          i32.const 1
          i32.eq
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 4
            local.get 6
            call 1
            i32.const 1
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 2
            call 4
            br 2 (;@2;)
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.load offset=12
          local.set 6
          local.get 2
          i32.const 16
          i32.add
          local.set 4
          local.get 0
          i32.const 20
          i32.add
          i32.load
          local.set 5
        end
        local.get 3
        i32.const 2
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 4
          local.get 6
          local.get 5
          local.get 1
          call_indirect (type 4)
          i32.const 2
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 2
          i32.load offset=24
          local.set 6
          local.get 2
          i32.load offset=16
          local.set 4
        end
        local.get 3
        i32.const 3
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 4
          local.get 6
          call 2
          i32.const 3
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 2
          i32.const 16
          i32.add
          call 4
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        call 4
        local.get 0
        i32.const 12
        i32.add
        call 4
        local.get 2
        i32.const 32
        i32.add
        global.set 0
        local.get 1
        i32.const 0
        i32.ne
        return
      end
      unreachable
    end
    local.set 3
    global.get 4
    i32.load
    local.get 3
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 3
    local.get 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 2
    i32.store offset=8
    local.get 3
    local.get 4
    i32.store offset=12
    local.get 3
    local.get 6
    i32.store offset=16
    local.get 3
    local.get 5
    i32.store offset=20
    global.get 4
    global.get 4
    i32.load
    i32.const 24
    i32.add
    i32.store
    i32.const 0)
  (func (;74;) (type 4) (param i32 i32 i32)
    block  ;; label = @1
      local.get 1
      i32.eqz
      if  ;; label = @2
        i32.const 0
        local.set 1
        br 1 (;@1;)
      end
      local.get 1
      local.get 2
      call 18
      local.set 2
    end
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    local.get 2
    i32.store)
  (func (;75;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 48
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 4
      local.get 3
      i32.load offset=12
      local.set 5
      local.get 3
      i32.load offset=16
      local.set 6
      local.get 3
      i32.load offset=20
      local.set 7
      local.get 3
      i32.load offset=24
      local.set 8
      local.get 3
      i32.load offset=28
      local.set 9
      local.get 3
      i32.load offset=32
      local.set 10
      local.get 3
      i32.load offset=36
      local.set 11
      local.get 3
      i32.load offset=40
      local.set 12
      local.get 3
      i32.load offset=44
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 2
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 48
        i32.sub
        local.tee 7
        global.set 0
        local.get 1
        i32.load offset=8
        local.tee 11
        i64.extend_i32_u
        i64.const 36
        i64.mul
        local.tee 13
        i64.const 32
        i64.shr_u
        i32.wrap_i64
        local.set 5
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        if  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                local.get 5
                br_if 0 (;@6;)
                i32.const 0
                local.set 5
                local.get 13
                i32.wrap_i64
                local.tee 6
                i32.const 0
                i32.lt_s
                br_if 0 (;@6;)
                local.get 1
                i32.load
                local.set 1
                local.get 6
                br_if 1 (;@5;)
                i32.const 4
                local.set 9
                br 2 (;@4;)
              end
              call 25
              unreachable
            end
            local.get 6
            local.set 5
            local.get 6
            i32.const 4
            call 18
            local.tee 9
            i32.eqz
            br_if 2 (;@2;)
          end
          local.get 0
          i32.const 0
          i32.store offset=8
          local.get 0
          local.get 9
          i32.store
          local.get 0
          local.get 5
          i32.const 36
          i32.div_u
          local.tee 5
          i32.store offset=4
          local.get 7
          i32.const 8
          i32.add
          local.tee 4
          i32.const 12
          i32.add
          local.set 12
          local.get 7
          i32.const 32
          i32.add
          local.set 10
        end
        loop  ;; label = @3
          block  ;; label = @4
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 5
              i32.eqz
              br_if 1 (;@4;)
              local.get 6
              i32.eqz
              br_if 1 (;@4;)
              local.get 1
              i32.load
              local.set 8
              local.get 1
              i32.const 8
              i32.add
              i32.load
              local.set 4
              local.get 7
              i32.const 8
              i32.add
              local.set 3
            end
            local.get 2
            i32.eqz
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 3
              local.get 8
              local.get 4
              call 36
              i32.const 0
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 1
              i32.const 12
              i32.add
              i32.load
              local.set 8
              local.get 1
              i32.const 20
              i32.add
              i32.load
              local.set 4
            end
            local.get 2
            i32.const 1
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 12
              local.get 8
              local.get 4
              call 36
              i32.const 1
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 1
              i32.const 24
              i32.add
              i32.load
              local.set 8
              local.get 1
              i32.const 32
              i32.add
              i32.load
              local.set 4
            end
            local.get 2
            i32.const 2
            i32.eq
            i32.const 1
            global.get 3
            select
            if  ;; label = @5
              local.get 10
              local.get 8
              local.get 4
              call 36
              i32.const 2
              global.get 3
              i32.const 1
              i32.eq
              br_if 4 (;@1;)
              drop
            end
            global.get 3
            i32.eqz
            if  ;; label = @5
              local.get 6
              i32.const 36
              i32.sub
              local.set 6
              local.get 9
              local.get 7
              i32.const 8
              i32.add
              i32.const 36
              call 85
              local.tee 4
              i32.const 36
              i32.add
              local.set 9
              local.get 1
              i32.const 36
              i32.add
              local.set 1
              local.get 5
              i32.const 1
              i32.sub
              local.set 5
              br 2 (;@3;)
            end
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          local.get 11
          i32.store offset=8
          local.get 7
          i32.const 48
          i32.add
          global.set 0
          return
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        i32.const 1054048
        i32.load
        local.tee 1
        i32.const 3
        local.get 1
        select
        local.set 0
      end
      local.get 2
      i32.const 3
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 6
        i32.const 4
        local.get 0
        call_indirect (type 1)
        i32.const 3
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        unreachable
      end
      return
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 4
    i32.store offset=8
    local.get 2
    local.get 5
    i32.store offset=12
    local.get 2
    local.get 6
    i32.store offset=16
    local.get 2
    local.get 7
    i32.store offset=20
    local.get 2
    local.get 8
    i32.store offset=24
    local.get 2
    local.get 9
    i32.store offset=28
    local.get 2
    local.get 10
    i32.store offset=32
    local.get 2
    local.get 11
    i32.store offset=36
    local.get 2
    local.get 12
    i32.store offset=40
    local.get 2
    local.get 3
    i32.store offset=44
    global.get 4
    global.get 4
    i32.load
    i32.const 48
    i32.add
    i32.store)
  (func (;76;) (type 5) (param i32 i32 i32 i32)
    (local i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 24
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 5
      i32.load
      local.set 0
      local.get 5
      i32.load offset=4
      local.set 1
      local.get 5
      i32.load offset=8
      local.set 2
      local.get 5
      i32.load offset=12
      local.set 3
      local.get 5
      i32.load offset=16
      local.set 4
      local.get 5
      i32.load offset=20
      local.set 5
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 6
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 112
        i32.sub
        local.tee 4
        global.set 0
        block  ;; label = @3
          local.get 3
          i32.load
          local.tee 5
          i32.eqz
          if  ;; label = @4
            local.get 4
            i32.const 24
            i32.add
            i64.const 0
            i64.store
            local.get 4
            i64.const 0
            i64.store offset=12 align=4
            local.get 4
            i32.const 1053616
            i32.load
            i32.store offset=20
            local.get 4
            i32.const 1053996
            i32.load
            i32.store offset=8
            br 1 (;@3;)
          end
          local.get 4
          i32.const 20
          i32.add
          local.get 3
          i32.const 12
          i32.add
          i64.load align=4
          i64.store align=4
          local.get 4
          i32.const 28
          i32.add
          local.get 3
          i32.const 20
          i32.add
          i32.load
          i32.store
          local.get 4
          local.get 5
          i32.store offset=8
          local.get 4
          local.get 3
          i64.load offset=4 align=4
          i64.store offset=12 align=4
        end
        local.get 4
        i32.const 0
        i32.store offset=32
        local.get 4
        local.get 2
        i32.store offset=36
        local.get 2
        i32.const 1073741824
        i32.gt_s
        local.set 5
        i32.const 0
        local.set 3
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        i32.const 0
        local.get 5
        select
        i32.eqz
        if  ;; label = @3
          local.get 6
          i32.eqz
          i32.const 1
          global.get 3
          select
          if  ;; label = @4
            local.get 4
            local.get 2
            call 17
            i32.const 0
            global.get 3
            i32.const 1
            i32.eq
            br_if 3 (;@1;)
            drop
          end
          global.get 3
          i32.eqz
          if  ;; label = @4
            local.get 4
            i32.load offset=4
            local.set 5
            local.get 4
            i32.load
            local.get 1
            local.get 2
            call 85
            local.set 6
            local.get 0
            i32.const 24
            i32.add
            i32.const 0
            i32.store
            local.get 0
            i32.const 20
            i32.add
            local.get 2
            i32.store
            local.get 0
            i32.const 16
            i32.add
            local.get 2
            i32.store
            local.get 0
            i32.const 12
            i32.add
            local.get 5
            i32.store
            local.get 0
            i32.const 8
            i32.add
            local.get 6
            i32.store
            local.get 0
            local.get 1
            i32.store offset=4
            local.get 0
            i32.const 28
            i32.add
            local.get 4
            i64.load offset=8
            i64.store align=4
            local.get 0
            i32.const 36
            i32.add
            local.get 4
            i32.const 16
            i32.add
            i64.load
            i64.store align=4
            local.get 0
            i32.const 44
            i32.add
            local.get 4
            i32.const 24
            i32.add
            i64.load
            i64.store align=4
            br 2 (;@2;)
          end
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 4
          i32.const 76
          i32.add
          i32.const 4
          i32.store
          local.get 4
          i32.const 108
          i32.add
          i32.const 12
          i32.store
          local.get 4
          i32.const 100
          i32.add
          i32.const 12
          i32.store
          local.get 4
          i32.const 92
          i32.add
          i32.const 12
          i32.store
          local.get 4
          i64.const 5
          i64.store offset=60 align=4
          local.get 4
          i32.const 1053064
          i32.store offset=56
          local.get 4
          i32.const 8
          i32.store offset=84
          local.get 4
          i32.const 1053120
          i32.store offset=80
          local.get 4
          local.get 4
          i32.const 80
          i32.add
          i32.store offset=72
          local.get 4
          local.get 4
          i32.const 36
          i32.add
          i32.store offset=104
          local.get 4
          local.get 4
          i32.const 32
          i32.add
          i32.store offset=96
          local.get 4
          local.get 4
          i32.const 36
          i32.add
          i32.store offset=88
          local.get 4
          i32.const 56
          i32.add
          local.set 2
          local.get 4
          i32.const 40
          i32.add
          local.set 1
        end
        local.get 6
        i32.const 1
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 1
          local.get 2
          call 30
          i32.const 1
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 4
          i32.const 8
          i32.add
          local.set 2
          local.get 4
          i32.load offset=40
          local.set 3
          local.get 4
          i32.load offset=48
          local.set 5
          local.get 0
          i32.const 4
          i32.add
          local.set 1
        end
        local.get 6
        i32.const 2
        i32.eq
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 1
          local.get 2
          local.get 3
          local.get 5
          call 63
          i32.const 2
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 4
          i32.const 40
          i32.add
          call 4
          local.get 4
          i32.const 8
          i32.add
          call 4
          local.get 4
          i32.const 20
          i32.add
          local.tee 2
          call 6
          local.get 2
          call 7
          i32.const 1
          local.set 3
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        local.get 3
        i32.store
        local.get 4
        i32.const 112
        i32.add
        global.set 0
      end
      return
    end
    local.set 6
    global.get 4
    i32.load
    local.get 6
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 6
    local.get 0
    i32.store
    local.get 6
    local.get 1
    i32.store offset=4
    local.get 6
    local.get 2
    i32.store offset=8
    local.get 6
    local.get 3
    i32.store offset=12
    local.get 6
    local.get 4
    i32.store offset=16
    local.get 6
    local.get 5
    i32.store offset=20
    global.get 4
    global.get 4
    i32.load
    i32.const 24
    i32.add
    i32.store)
  (func (;77;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 32
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=8
      local.set 2
      local.get 3
      i32.load offset=12
      local.set 4
      local.get 3
      i32.load offset=16
      local.set 5
      local.get 3
      i32.load offset=20
      local.set 6
      local.get 3
      i32.load offset=24
      local.set 7
      local.get 3
      i32.load offset=28
      local.set 8
      local.get 3
      i32.load offset=4
      local.set 1
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 9
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 48
        i32.sub
        local.tee 4
        global.set 0
        local.get 2
        i32.const 3
        i32.shl
        local.set 3
        local.get 1
        i32.const 8
        i32.add
        local.set 8
        i32.const 0
        local.set 7
        local.get 1
        local.set 6
        block  ;; label = @3
          loop  ;; label = @4
            local.get 3
            i32.eqz
            br_if 1 (;@3;)
            local.get 3
            i32.const 8
            i32.sub
            local.set 3
            local.get 7
            local.get 7
            local.get 6
            i32.load offset=4
            i32.add
            local.tee 5
            i32.le_u
            local.set 10
            local.get 6
            i32.const 8
            i32.add
            local.set 6
            local.get 5
            local.set 7
            local.get 10
            br_if 0 (;@4;)
          end
          global.get 0
          i32.const 16
          i32.sub
          local.tee 1
          global.set 0
          local.get 1
          i32.const 53
          i32.store offset=12
          local.get 1
          i32.const 1053456
          i32.store offset=8
          global.get 0
          i32.const 32
          i32.sub
          local.tee 0
          global.set 0
          local.get 0
          i32.const 20
          i32.add
          i32.const 1
          i32.store
          local.get 0
          i64.const 1
          i64.store offset=4 align=4
          local.get 0
          i32.const 1053792
          i32.store
          local.get 0
          i32.const 2
          i32.store offset=28
          local.get 0
          local.get 1
          i32.const 8
          i32.add
          i32.store offset=24
          local.get 0
          local.get 0
          i32.const 24
          i32.add
          i32.store offset=16
          local.get 0
          i32.const 1053584
          call 40
          unreachable
        end
        local.get 4
        i32.const 8
        i32.add
        local.set 5
      end
      local.get 9
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 5
        local.get 7
        call 17
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.const 0
        i32.store offset=24
        local.get 4
        local.get 4
        i64.load offset=8
        i64.store offset=16
        local.get 4
        i32.const 16
        i32.add
        local.set 5
        local.get 1
        i32.load
        local.set 6
        local.get 1
        i32.load offset=4
        local.set 1
      end
      local.get 9
      i32.const 1
      i32.eq
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 5
        local.get 6
        local.get 1
        call 78
        i32.const 1
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 2
        i32.const 3
        i32.shl
        i32.const 8
        i32.sub
        local.set 3
        local.get 7
        local.get 4
        i32.load offset=24
        local.tee 5
        i32.sub
        local.set 6
        local.get 5
        local.get 4
        i32.load offset=16
        i32.add
        local.set 5
        loop  ;; label = @3
          local.get 3
          if  ;; label = @4
            local.get 4
            i32.const 32
            i32.add
            local.get 5
            local.get 6
            i32.const 0
            call 79
            local.get 4
            i32.load offset=44
            local.set 6
            local.get 4
            i32.load offset=40
            local.set 5
            local.get 4
            i32.load offset=32
            local.get 4
            i32.load offset=36
            i32.const 1053952
            i32.const 0
            call 80
            local.get 8
            i32.load
            local.set 10
            local.get 4
            i32.const 32
            i32.add
            local.get 5
            local.get 6
            local.get 8
            i32.load offset=4
            local.tee 1
            call 79
            local.get 4
            i32.load offset=44
            local.set 6
            local.get 4
            i32.load offset=40
            local.set 5
            local.get 4
            i32.load offset=32
            local.get 4
            i32.load offset=36
            local.get 10
            local.get 1
            call 80
            local.get 3
            i32.const 8
            i32.sub
            local.set 3
            local.get 8
            i32.const 8
            i32.add
            local.set 8
            br 1 (;@3;)
          end
        end
        local.get 0
        local.get 4
        i64.load offset=16
        i64.store align=4
        local.get 0
        i32.const 8
        i32.add
        local.get 7
        local.get 6
        i32.sub
        i32.store
        local.get 4
        i32.const 48
        i32.add
        global.set 0
      end
      return
    end
    local.set 3
    global.get 4
    i32.load
    local.get 3
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 3
    local.get 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 2
    i32.store offset=8
    local.get 3
    local.get 4
    i32.store offset=12
    local.get 3
    local.get 5
    i32.store offset=16
    local.get 3
    local.get 6
    i32.store offset=20
    local.get 3
    local.get 7
    i32.store offset=24
    local.get 3
    local.get 8
    i32.store offset=28
    global.get 4
    global.get 4
    i32.load
    i32.const 32
    i32.add
    i32.store)
  (func (;78;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 28
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 2
      local.get 3
      i32.load offset=12
      local.set 6
      local.get 3
      i32.load offset=16
      local.set 10
      local.get 3
      i32.load offset=20
      local.set 7
      local.get 3
      i32.load offset=24
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 5
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        global.get 0
        i32.const 16
        i32.sub
        local.tee 10
        global.set 0
        local.get 0
        i32.load offset=4
        local.get 0
        i32.load offset=8
        local.tee 6
        i32.sub
        local.get 2
        i32.ge_u
        local.set 7
      end
      block  ;; label = @2
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 7
          br_if 1 (;@2;)
          local.get 10
          local.set 4
          local.get 0
          local.set 8
          global.get 0
          i32.const 16
          i32.sub
          local.tee 7
          global.set 0
          block  ;; label = @4
            block  ;; label = @5
              local.get 6
              local.get 2
              local.get 6
              i32.add
              local.tee 3
              i32.le_u
              if  ;; label = @6
                i32.const 0
                local.set 6
                local.get 8
                i32.load offset=4
                local.tee 15
                i32.const 1
                i32.shl
                local.tee 9
                local.get 3
                local.get 3
                local.get 9
                i32.lt_u
                select
                local.tee 3
                i32.const 8
                i32.gt_u
                local.set 9
                local.get 8
                i32.load
                i32.const 0
                local.get 15
                select
                local.set 13
                global.get 0
                i32.const 16
                i32.sub
                local.tee 11
                global.set 0
                local.get 7
                local.tee 14
                block (result i32)  ;; label = @7
                  local.get 3
                  i32.const 8
                  local.get 9
                  select
                  local.tee 3
                  i32.const 0
                  i32.ge_s
                  if  ;; label = @8
                    block (result i32)  ;; label = @9
                      local.get 13
                      if  ;; label = @10
                        local.get 15
                        i32.eqz
                        if  ;; label = @11
                          local.get 11
                          i32.const 8
                          i32.add
                          local.get 3
                          call 82
                          local.get 11
                          i32.load offset=12
                          local.set 12
                          local.get 11
                          i32.load offset=8
                          br 2 (;@9;)
                        end
                        local.get 3
                        local.set 12
                        local.get 13
                        local.get 3
                        call 22
                        br 1 (;@9;)
                      end
                      local.get 11
                      local.get 3
                      call 82
                      local.get 11
                      i32.load offset=4
                      local.set 12
                      local.get 11
                      i32.load
                    end
                    local.tee 13
                    if  ;; label = @9
                      local.get 14
                      local.get 13
                      i32.store offset=4
                      i32.const 0
                      br 2 (;@7;)
                    end
                    local.get 14
                    local.get 3
                    i32.store offset=4
                    i32.const 1
                    local.set 12
                  end
                  i32.const 1
                end
                i32.store
                local.get 14
                i32.const 8
                i32.add
                local.get 12
                i32.store
                local.get 11
                i32.const 16
                i32.add
                global.set 0
                local.get 7
                i32.load
                i32.const 1
                i32.ne
                if  ;; label = @7
                  local.get 8
                  local.get 7
                  i64.load offset=4 align=4
                  i64.store align=4
                  br 3 (;@4;)
                end
                local.get 4
                local.get 7
                i64.load offset=4 align=4
                i64.store offset=4 align=4
                br 1 (;@5;)
              end
              local.get 4
              local.get 3
              i32.store offset=4
              local.get 4
              i32.const 8
              i32.add
              i32.const 0
              i32.store
            end
            i32.const 1
            local.set 6
          end
          local.get 4
          local.get 6
          i32.store
          local.get 7
          i32.const 16
          i32.add
          global.set 0
          local.get 10
          i32.const 8
          i32.add
          i32.load
          local.set 3
          local.get 10
          i32.load
          local.set 6
          local.get 10
          i32.load offset=4
          local.set 7
        end
        local.get 5
        i32.eqz
        i32.const 1
        global.get 3
        select
        if  ;; label = @3
          local.get 6
          local.set 4
          local.get 7
          local.set 5
          local.get 3
          local.set 8
          i32.const 0
          local.set 9
          global.get 3
          i32.const 2
          i32.eq
          if  ;; label = @4
            global.get 4
            global.get 4
            i32.load
            i32.const 12
            i32.sub
            i32.store
            global.get 4
            i32.load
            local.tee 8
            i32.load
            local.set 4
            local.get 8
            i32.load offset=4
            local.set 5
            local.get 8
            i32.load offset=8
            local.set 8
          end
          block  ;; label = @4
            block (result i32)  ;; label = @5
              global.get 3
              i32.const 2
              i32.eq
              if  ;; label = @6
                global.get 4
                global.get 4
                i32.load
                i32.const 4
                i32.sub
                i32.store
                global.get 4
                i32.load
                i32.load
                local.set 9
              end
              local.get 4
              local.get 4
              i32.const 1
              i32.ne
              global.get 3
              select
              local.set 4
              block  ;; label = @6
                block  ;; label = @7
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    local.get 4
                    br_if 1 (;@7;)
                    local.get 8
                    i32.eqz
                    br_if 2 (;@6;)
                    i32.const 1054048
                    i32.load
                    local.tee 4
                    i32.const 3
                    local.get 4
                    select
                    local.set 4
                  end
                  local.get 9
                  i32.eqz
                  i32.const 1
                  global.get 3
                  select
                  if  ;; label = @8
                    local.get 5
                    local.get 8
                    local.get 4
                    call_indirect (type 1)
                    i32.const 0
                    global.get 3
                    i32.const 1
                    i32.eq
                    br_if 3 (;@5;)
                    drop
                  end
                  global.get 3
                  i32.eqz
                  if  ;; label = @8
                    unreachable
                  end
                end
                global.get 3
                i32.eqz
                br_if 2 (;@4;)
              end
              global.get 3
              i32.eqz
              if  ;; label = @6
                call 25
                unreachable
              end
              br 1 (;@4;)
            end
            local.set 9
            global.get 4
            i32.load
            local.get 9
            i32.store
            global.get 4
            global.get 4
            i32.load
            i32.const 4
            i32.add
            i32.store
            global.get 4
            i32.load
            local.tee 9
            local.get 4
            i32.store
            local.get 9
            local.get 5
            i32.store offset=4
            local.get 9
            local.get 8
            i32.store offset=8
            global.get 4
            global.get 4
            i32.load
            i32.const 12
            i32.add
            i32.store
          end
          i32.const 0
          global.get 3
          i32.const 1
          i32.eq
          br_if 2 (;@1;)
          drop
        end
        global.get 3
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.load offset=8
          local.set 6
        end
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 6
        local.get 0
        i32.load
        i32.add
        local.get 1
        local.get 2
        call 85
        drop
        local.get 0
        local.get 2
        local.get 6
        i32.add
        i32.store offset=8
        local.get 10
        i32.const 16
        i32.add
        global.set 0
      end
      return
    end
    local.set 5
    global.get 4
    i32.load
    local.get 5
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 5
    local.get 0
    i32.store
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    local.get 2
    i32.store offset=8
    local.get 5
    local.get 6
    i32.store offset=12
    local.get 5
    local.get 10
    i32.store offset=16
    local.get 5
    local.get 7
    i32.store offset=20
    local.get 5
    local.get 3
    i32.store offset=24
    global.get 4
    global.get 4
    i32.load
    i32.const 28
    i32.add
    i32.store)
  (func (;79;) (type 5) (param i32 i32 i32 i32)
    local.get 2
    local.get 3
    i32.ge_u
    if  ;; label = @1
      local.get 0
      local.get 3
      i32.store offset=4
      local.get 0
      local.get 1
      i32.store
      local.get 0
      i32.const 12
      i32.add
      local.get 2
      local.get 3
      i32.sub
      i32.store
      local.get 0
      local.get 1
      local.get 3
      i32.add
      i32.store offset=8
      return
    end
    i32.const 1053328
    i32.const 35
    i32.const 1053440
    call 26
    unreachable)
  (func (;80;) (type 5) (param i32 i32 i32 i32)
    local.get 1
    local.get 3
    i32.eq
    if  ;; label = @1
      local.get 0
      local.get 2
      local.get 1
      call 85
      drop
      return
    end
    global.get 0
    i32.const 48
    i32.sub
    local.tee 0
    global.set 0
    local.get 0
    local.get 3
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 0
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 0
    i32.const 44
    i32.add
    i32.const 5
    i32.store
    local.get 0
    i64.const 3
    i64.store offset=12 align=4
    local.get 0
    i32.const 1049992
    i32.store offset=8
    local.get 0
    i32.const 5
    i32.store offset=36
    local.get 0
    local.get 0
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 0
    local.get 0
    i32.store offset=40
    local.get 0
    local.get 0
    i32.const 4
    i32.add
    i32.store offset=32
    local.get 0
    i32.const 8
    i32.add
    i32.const 1053600
    call 40
    unreachable)
  (func (;81;) (type 0) (param i32 i32) (result i32)
    (local i32 i32)
    global.get 3
    i32.const 2
    i32.eq
    if  ;; label = @1
      global.get 4
      global.get 4
      i32.load
      i32.const 12
      i32.sub
      i32.store
      global.get 4
      i32.load
      local.tee 3
      i32.load
      local.set 0
      local.get 3
      i32.load offset=4
      local.set 1
      local.get 3
      i32.load offset=8
      local.set 3
    end
    block (result i32)  ;; label = @1
      global.get 3
      i32.const 2
      i32.eq
      if  ;; label = @2
        global.get 4
        global.get 4
        i32.load
        i32.const 4
        i32.sub
        i32.store
        global.get 4
        i32.load
        i32.load
        local.set 2
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.load
        local.set 3
        local.get 0
        i32.load offset=8
        local.set 0
      end
      local.get 2
      i32.eqz
      i32.const 1
      global.get 3
      select
      if  ;; label = @2
        local.get 1
        local.get 3
        local.get 0
        call 47
        local.set 2
        i32.const 0
        global.get 3
        i32.const 1
        i32.eq
        br_if 1 (;@1;)
        drop
        local.get 2
        local.set 0
      end
      global.get 3
      i32.eqz
      if  ;; label = @2
        local.get 0
        return
      end
      unreachable
    end
    local.set 2
    global.get 4
    i32.load
    local.get 2
    i32.store
    global.get 4
    global.get 4
    i32.load
    i32.const 4
    i32.add
    i32.store
    global.get 4
    i32.load
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 3
    i32.store offset=8
    global.get 4
    global.get 4
    i32.load
    i32.const 12
    i32.add
    i32.store
    i32.const 0)
  (func (;82;) (type 1) (param i32 i32)
    (local i32)
    block (result i32)  ;; label = @1
      local.get 1
      i32.eqz
      if  ;; label = @2
        i32.const 0
        local.set 1
        i32.const 1
        br 1 (;@1;)
      end
      local.get 1
      call 19
    end
    local.set 2
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    local.get 2
    i32.store)
  (func (;83;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32)
    i32.const 31
    local.set 2
    local.get 0
    i64.const 0
    i64.store offset=16 align=4
    local.get 1
    i32.const 16777215
    i32.le_u
    if  ;; label = @1
      local.get 1
      i32.const 6
      local.get 1
      i32.const 8
      i32.shr_u
      i32.clz
      local.tee 2
      i32.sub
      i32.shr_u
      i32.const 1
      i32.and
      local.get 2
      i32.const 1
      i32.shl
      i32.sub
      i32.const 62
      i32.add
      local.set 2
    end
    local.get 0
    local.get 2
    i32.store offset=28
    local.get 2
    i32.const 2
    i32.shl
    i32.const 1054332
    i32.add
    local.set 3
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            i32.const 1054064
            i32.load
            local.tee 4
            i32.const 1
            local.get 2
            i32.shl
            local.tee 5
            i32.and
            if  ;; label = @5
              local.get 3
              i32.load
              local.tee 4
              i32.load offset=4
              i32.const -8
              i32.and
              local.get 1
              i32.ne
              br_if 1 (;@4;)
              local.get 4
              local.set 2
              br 2 (;@3;)
            end
            i32.const 1054064
            local.get 4
            local.get 5
            i32.or
            i32.store
            local.get 3
            local.get 0
            i32.store
            local.get 0
            local.get 3
            i32.store offset=24
            br 3 (;@1;)
          end
          local.get 1
          i32.const 0
          i32.const 25
          local.get 2
          i32.const 1
          i32.shr_u
          i32.sub
          i32.const 31
          i32.and
          local.get 2
          i32.const 31
          i32.eq
          select
          i32.shl
          local.set 3
          loop  ;; label = @4
            local.get 4
            local.get 3
            i32.const 29
            i32.shr_u
            i32.const 4
            i32.and
            i32.add
            i32.const 16
            i32.add
            local.tee 5
            i32.load
            local.tee 2
            i32.eqz
            br_if 2 (;@2;)
            local.get 3
            i32.const 1
            i32.shl
            local.set 3
            local.get 2
            local.set 4
            local.get 2
            i32.load offset=4
            i32.const -8
            i32.and
            local.get 1
            i32.ne
            br_if 0 (;@4;)
          end
        end
        local.get 2
        i32.load offset=8
        local.tee 3
        local.get 0
        i32.store offset=12
        local.get 2
        local.get 0
        i32.store offset=8
        local.get 0
        i32.const 0
        i32.store offset=24
        local.get 0
        local.get 2
        i32.store offset=12
        local.get 0
        local.get 3
        i32.store offset=8
        return
      end
      local.get 5
      local.get 0
      i32.store
      local.get 0
      local.get 4
      i32.store offset=24
    end
    local.get 0
    local.get 0
    i32.store offset=12
    local.get 0
    local.get 0
    i32.store offset=8)
  (func (;84;) (type 6)
    (local i32 i32)
    i32.const 1054508
    block (result i32)  ;; label = @1
      i32.const 4095
      i32.const 1054492
      i32.load
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      drop
      loop  ;; label = @2
        local.get 0
        i32.const 1
        i32.add
        local.set 0
        local.get 1
        i32.load offset=8
        local.tee 1
        br_if 0 (;@2;)
      end
      local.get 0
      i32.const 4095
      local.get 0
      i32.const 4095
      i32.gt_u
      select
    end
    i32.store)
  (func (;85;) (type 2) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    block  ;; label = @1
      local.get 2
      i32.const 15
      i32.le_u
      if  ;; label = @2
        local.get 0
        local.set 3
        br 1 (;@1;)
      end
      i32.const 0
      local.get 0
      i32.sub
      i32.const 3
      i32.and
      local.tee 6
      local.get 0
      i32.add
      local.set 4
      local.get 6
      if  ;; label = @2
        local.get 0
        local.set 3
        local.get 1
        local.set 5
        loop  ;; label = @3
          local.get 3
          local.get 5
          i32.load8_u
          i32.store8
          local.get 5
          i32.const 1
          i32.add
          local.set 5
          local.get 4
          local.get 3
          i32.const 1
          i32.add
          local.tee 3
          i32.gt_u
          br_if 0 (;@3;)
        end
      end
      local.get 2
      local.get 6
      i32.sub
      local.tee 9
      i32.const -4
      i32.and
      local.tee 8
      local.get 4
      i32.add
      local.set 3
      block  ;; label = @2
        local.get 1
        local.get 6
        i32.add
        local.tee 7
        i32.const 3
        i32.and
        if  ;; label = @3
          local.get 8
          i32.const 1
          i32.lt_s
          br_if 1 (;@2;)
          local.get 7
          i32.const 3
          i32.shl
          local.tee 1
          i32.const 24
          i32.and
          local.set 2
          i32.const 0
          local.get 1
          i32.sub
          i32.const 24
          i32.and
          local.set 6
          local.get 7
          i32.const -4
          i32.and
          local.tee 5
          i32.const 4
          i32.add
          local.set 1
          local.get 5
          i32.load
          local.set 5
          loop  ;; label = @4
            local.get 4
            local.get 5
            local.get 2
            i32.shr_u
            local.get 1
            i32.load
            local.tee 5
            local.get 6
            i32.shl
            i32.or
            i32.store
            local.get 1
            i32.const 4
            i32.add
            local.set 1
            local.get 4
            i32.const 4
            i32.add
            local.tee 4
            local.get 3
            i32.lt_u
            br_if 0 (;@4;)
          end
          br 1 (;@2;)
        end
        local.get 8
        i32.const 1
        i32.lt_s
        br_if 0 (;@2;)
        local.get 7
        local.set 1
        loop  ;; label = @3
          local.get 4
          local.get 1
          i32.load
          i32.store
          local.get 1
          i32.const 4
          i32.add
          local.set 1
          local.get 4
          i32.const 4
          i32.add
          local.tee 4
          local.get 3
          i32.lt_u
          br_if 0 (;@3;)
        end
      end
      local.get 9
      i32.const 3
      i32.and
      local.set 2
      local.get 7
      local.get 8
      i32.add
      local.set 1
    end
    local.get 2
    i32.const 1
    i32.ge_s
    if  ;; label = @1
      local.get 2
      local.get 3
      i32.add
      local.set 4
      loop  ;; label = @2
        local.get 3
        local.get 1
        i32.load8_u
        i32.store8
        local.get 1
        i32.const 1
        i32.add
        local.set 1
        local.get 4
        local.get 3
        i32.const 1
        i32.add
        local.tee 3
        i32.gt_u
        br_if 0 (;@2;)
      end
    end
    local.get 0)
  (func (;86;) (type 3) (param i32)
    i32.const 1
    global.set 3
    local.get 0
    global.set 4
    global.get 4
    i32.load
    global.get 4
    i32.load offset=4
    i32.gt_u
    if  ;; label = @1
      unreachable
    end)
  (func (;87;) (type 6)
    i32.const 0
    global.set 3
    global.get 4
    i32.load
    global.get 4
    i32.load offset=4
    i32.gt_u
    if  ;; label = @1
      unreachable
    end)
  (func (;88;) (type 3) (param i32)
    i32.const 2
    global.set 3
    local.get 0
    global.set 4
    global.get 4
    i32.load
    global.get 4
    i32.load offset=4
    i32.gt_u
    if  ;; label = @1
      unreachable
    end)
  (func (;89;) (type 10) (result i32)
    global.get 3)
  (table (;0;) 28 28 funcref)
  (memory (;0;) 17)
  (global (;0;) (mut i32) (i32.const 1048576))
  (global (;1;) i32 (i32.const 1054520))
  (global (;2;) i32 (i32.const 1054528))
  (global (;3;) (mut i32) (i32.const 0))
  (global (;4;) (mut i32) (i32.const 0))
  (export "memory" (memory 0))
  (export "_w3_invoke" (func 72))
  (export "__data_end" (global 1))
  (export "__heap_base" (global 2))
  (export "asyncify_start_unwind" (func 86))
  (export "asyncify_stop_unwind" (func 87))
  (export "asyncify_start_rewind" (func 88))
  (export "asyncify_stop_rewind" (func 87))
  (export "asyncify_get_state" (func 89))
  (elem (;0;) (i32.const 1) func 49 48 29 37 39 51 52 48 81 58 71 56 3 15 32 33 34 35 57 32 42 3 15 3 15 3 15)
  (data (;0;) (i32.const 1048576) "\0d\00\00\00\0c\00\00\00\04\00\00\00\0e\00\00\00Deserializing query-type: mutation_methodsrc/w3/mutation/serialization.rs\00\00\009\00\10\00 \00\00\00\17\00\00\006\00\00\009\00\10\00 \00\00\00\1e\00\00\00*\00\00\00argu8type found, reading argument\00\00\009\00\10\00 \00\00\00#\00\00\00)\00\00\00Missing required argument: 'arg: UInt8'Serializing (sizing) query-type: mutation_methodSerializing (encoding) query-type: mutation_methodmutation_methodwriting resultDeserializing query-type: abstract_mutation_method9\00\10\00 \00\00\00O\00\00\006\00\00\009\00\10\00 \00\00\00V\00\00\00*\00\00\009\00\10\00 \00\00\00[\00\00\00)\00\00\00Serializing (sizing) query-type: abstract_mutation_methodSerializing (encoding) query-type: abstract_mutation_methodabstract_mutation_method\0f\00\00\00\04\00\00\00\04\00\00\00\10\00\00\00\11\00\00\00\12\00\00\00\0f\00\00\00\00\00\00\00\01\00\00\00\13\00\00\00library/alloc/src/raw_vec.rscapacity overflow\00\00\00l\02\10\00\1c\00\00\00\05\02\00\00\05\00\00\00a formatting trait implementation returned an errorlibrary/alloc/src/fmt.rs\00\df\02\10\00\18\00\00\00U\02\00\00\1c\00\00\00..\00\00\08\03\10\00\02\00\00\00\14\00\00\00\00\00\00\00\01\00\00\00\15\00\00\00index out of bounds: the len is  but the index is \00\00$\03\10\00 \00\00\00D\03\10\00\12\00\00\00`: \00\00\15\10\00\00\00\00\00i\03\10\00\02\00\00\00)library/core/src/fmt/num.rs}\03\10\00\1b\00\00\00e\00\00\00\14\00\00\000x00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899library/core/src/fmt/mod.rs\00\00\00r\04\10\00\1b\00\00\00]\08\00\00\1e\00\00\00r\04\10\00\1b\00\00\00d\08\00\00\16\00\00\00range start index  out of range for slice of length \b0\04\10\00\12\00\00\00\c2\04\10\00\22\00\00\00range end index \f4\04\10\00\10\00\00\00\c2\04\10\00\22\00\00\00slice index starts at  but ends at \00\14\05\10\00\16\00\00\00*\05\10\00\0d\00\00\00source slice length () does not match destination slice length (H\05\10\00\15\00\00\00]\05\10\00+\00\00\00|\03\10\00\01\00\00\00library/core/src/str/validations.rs\00\a0\05\10\00#\00\00\00\1e\01\00\00\11\00\00\00[...]byte index  is out of bounds of `\00\00\d9\05\10\00\0b\00\00\00\e4\05\10\00\16\00\00\00h\03\10\00\01\00\00\00begin <= end ( <= ) when slicing `\00\00\14\06\10\00\0e\00\00\00\22\06\10\00\04\00\00\00&\06\10\00\10\00\00\00h\03\10\00\01\00\00\00 is not a char boundary; it is inside  (bytes ) of `\d9\05\10\00\0b\00\00\00X\06\10\00&\00\00\00~\06\10\00\08\00\00\00\86\06\10\00\06\00\00\00h\03\10\00\01\00\00\00library/core/src/unicode/printable.rs\00\00\00\b4\06\10\00%\00\00\00\0a\00\00\00\1c\00\00\00\b4\06\10\00%\00\00\00\1a\00\00\006\00\00\00\00\01\03\05\05\06\06\02\07\06\08\07\09\11\0a\1c\0b\19\0c\1a\0d\10\0e\0d\0f\04\10\03\12\12\13\09\16\01\17\04\18\01\19\03\1a\07\1b\01\1c\02\1f\16 \03+\03-\0b.\010\031\022\01\a7\02\a9\02\aa\04\ab\08\fa\02\fb\05\fd\02\fe\03\ff\09\adxy\8b\8d\a20WX\8b\8c\90\1c\dd\0e\0fKL\fb\fc./?\5c]_\e2\84\8d\8e\91\92\a9\b1\ba\bb\c5\c6\c9\ca\de\e4\e5\ff\00\04\11\12)147:;=IJ]\84\8e\92\a9\b1\b4\ba\bb\c6\ca\ce\cf\e4\e5\00\04\0d\0e\11\12)14:;EFIJ^de\84\91\9b\9d\c9\ce\cf\0d\11):;EIW[\5c^_de\8d\91\a9\b4\ba\bb\c5\c9\df\e4\e5\f0\0d\11EIde\80\84\b2\bc\be\bf\d5\d7\f0\f1\83\85\8b\a4\a6\be\bf\c5\c7\ce\cf\da\dbH\98\bd\cd\c6\ce\cfINOWY^_\89\8e\8f\b1\b6\b7\bf\c1\c6\c7\d7\11\16\17[\5c\f6\f7\fe\ff\80mq\de\df\0e\1fno\1c\1d_}~\ae\af\7f\bb\bc\16\17\1e\1fFGNOXZ\5c^~\7f\b5\c5\d4\d5\dc\f0\f1\f5rs\8ftu\96&./\a7\af\b7\bf\c7\cf\d7\df\9a@\97\980\8f\1f\d2\d4\ce\ffNOZ[\07\08\0f\10'/\ee\efno7=?BE\90\91Sgu\c8\c9\d0\d1\d8\d9\e7\fe\ff\00 _\22\82\df\04\82D\08\1b\04\06\11\81\ac\0e\80\ab\05\1f\09\81\1b\03\19\08\01\04/\044\04\07\03\01\07\06\07\11\0aP\0f\12\07U\07\03\04\1c\0a\09\03\08\03\07\03\02\03\03\03\0c\04\05\03\0b\06\01\0e\15\05N\07\1b\07W\07\02\06\16\0dP\04C\03-\03\01\04\11\06\0f\0c:\04\1d%_ m\04j%\80\c8\05\82\b0\03\1a\06\82\fd\03Y\07\16\09\18\09\14\0c\14\0cj\06\0a\06\1a\06Y\07+\05F\0a,\04\0c\04\01\031\0b,\04\1a\06\0b\03\80\ac\06\0a\06/1M\03\80\a4\08<\03\0f\03<\078\08+\05\82\ff\11\18\08/\11-\03!\0f!\0f\80\8c\04\82\97\19\0b\15\88\94\05/\05;\07\02\0e\18\09\80\be\22t\0c\80\d6\1a\0c\05\80\ff\05\80\df\0c\f2\9d\037\09\81\5c\14\80\b8\08\80\cb\05\0a\18;\03\0a\068\08F\08\0c\06t\0b\1e\03Z\04Y\09\80\83\18\1c\0a\16\09L\04\80\8a\06\ab\a4\0c\17\041\a1\04\81\da&\07\0c\05\05\80\a6\10\81\f5\07\01 *\06L\04\80\8d\04\80\be\03\1b\03\0f\0d\00\06\01\01\03\01\04\02\05\07\07\02\08\08\09\02\0a\05\0b\02\0e\04\10\01\11\02\12\05\13\11\14\01\15\02\17\02\19\0d\1c\05\1d\08$\01j\04k\02\af\03\bc\02\cf\02\d1\02\d4\0c\d5\09\d6\02\d7\02\da\01\e0\05\e1\02\e7\04\e8\02\ee \f0\04\f8\02\fa\02\fb\01\0c';>NO\8f\9e\9e\9f{\8b\93\96\a2\b2\ba\86\b1\06\07\096=>V\f3\d0\d1\04\14\1867VW\7f\aa\ae\af\bd5\e0\12\87\89\8e\9e\04\0d\0e\11\12)14:EFIJNOde\5c\b6\b7\1b\1c\07\08\0a\0b\14\1769:\a8\a9\d8\d9\097\90\91\a8\07\0a;>fi\8f\92o_\bf\ee\efZb\f4\fc\ff\9a\9b./'(U\9d\a0\a1\a3\a4\a7\a8\ad\ba\bc\c4\06\0b\0c\15\1d:?EQ\a6\a7\cc\cd\a0\07\19\1a\22%>?\e7\ec\ef\ff\c5\c6\04 #%&(38:HJLPSUVXZ\5c^`cefksx}\7f\8a\a4\aa\af\b0\c0\d0\ae\afno\93^\22{\05\03\04-\03f\03\01/.\80\82\1d\031\0f\1c\04$\09\1e\05+\05D\04\0e*\80\aa\06$\04$\04(\084\0bNC\817\09\16\0a\08\18;E9\03c\08\090\16\05!\03\1b\05\01@8\04K\05/\04\0a\07\09\07@ '\04\0c\096\03:\05\1a\07\04\0c\07PI73\0d3\07.\08\0a\81&RN(\08*\16\1a&\1c\14\17\09N\04$\09D\0d\19\07\0a\06H\08'\09u\0b?A*\06;\05\0a\06Q\06\01\05\10\03\05\80\8bb\1eH\08\0a\80\a6^\22E\0b\0a\06\0d\13:\06\0a6,\04\17\80\b9<dS\0cH\09\0aFE\1bH\08S\0dI\81\07F\0a\1d\03GI7\03\0e\08\0a\069\07\0a\816\19\80\b7\01\0f2\0d\83\9bfu\0b\80\c4\8aLc\0d\84/\8f\d1\82G\a1\b9\829\07*\04\5c\06&\0aF\0a(\05\13\82\b0[eK\049\07\11@\05\0b\02\0e\97\f8\08\84\d6*\09\a2\e7\813-\03\11\04\08\81\8c\89\04k\05\0d\03\09\07\10\92`G\09t<\80\f6\0as\08p\15F\80\9a\14\0cW\09\19\80\87\81G\03\85B\0f\15\84P\1f\80\e1+\80\d5-\03\1a\04\02\81@\1f\11:\05\01\84\e0\80\f7)L\04\0a\04\02\83\11DL=\80\c2<\06\01\04U\05\1b4\02\81\0e,\04d\0cV\0a\80\ae8\1d\0d,\04\09\07\02\0e\06\80\9a\83\d8\05\10\03\0d\03t\0cY\07\0c\04\01\0f\0c\048\08\0a\06(\08\22N\81T\0c\15\03\05\03\07\09\1d\03\0b\05\06\0a\0a\06\08\08\07\09\80\cb%\0a\84\06library/core/src/unicode/unicode_data.rs\00\00\00e\0c\10\00(\00\00\00K\00\00\00(\00\00\00e\0c\10\00(\00\00\00W\00\00\00\16\00\00\00e\0c\10\00(\00\00\00R\00\00\00>\00\00\00Error\00\00\00\00\03\00\00\83\04 \00\91\05`\00]\13\a0\00\12\17 \1f\0c `\1f\ef,\a0+*0 ,o\a6\e0,\02\a8`-\1e\fb`.\00\fe 6\9e\ff`6\fd\01\e16\01\0a!7$\0d\e17\ab\0ea9/\18\a190\1c\e1G\f3\1e!L\f0j\e1OOo!P\9d\bc\a1P\00\cfaQe\d1\a1Q\00\da!R\00\e0\e1S0\e1aU\ae\e2\a1V\d0\e8\e1V \00nW\f0\01\ffW\00p\00\07\00-\01\01\01\02\01\02\01\01H\0b0\15\10\01e\07\02\06\02\02\01\04#\01\1e\1b[\0b:\09\09\01\18\04\01\09\01\03\01\05+\03<\08*\18\01 7\01\01\01\04\08\04\01\03\07\0a\02\1d\01:\01\01\01\02\04\08\01\09\01\0a\02\1a\01\02\029\01\04\02\04\02\02\03\03\01\1e\02\03\01\0b\029\01\04\05\01\02\04\01\14\02\16\06\01\01:\01\01\02\01\04\08\01\07\03\0a\02\1e\01;\01\01\01\0c\01\09\01(\01\03\017\01\01\03\05\03\01\04\07\02\0b\02\1d\01:\01\02\01\02\01\03\01\05\02\07\02\0b\02\1c\029\02\01\01\02\04\08\01\09\01\0a\02\1d\01H\01\04\01\02\03\01\01\08\01Q\01\02\07\0c\08b\01\02\09\0b\06J\02\1b\01\01\01\01\017\0e\01\05\01\02\05\0b\01$\09\01f\04\01\06\01\02\02\02\19\02\04\03\10\04\0d\01\02\02\06\01\0f\01\00\03\00\03\1d\02\1e\02\1e\02@\02\01\07\08\01\02\0b\09\01-\03\01\01u\02\22\01v\03\04\02\09\01\06\03\db\02\02\01:\01\01\07\01\01\01\01\02\08\06\0a\02\010\1f1\040\07\01\01\05\01(\09\0c\02 \04\02\02\01\038\01\01\02\03\01\01\03:\08\02\02\98\03\01\0d\01\07\04\01\06\01\03\02\c6@\00\01\c3!\00\03\8d\01` \00\06i\02\00\04\01\0a \02P\02\00\01\03\01\04\01\19\02\05\01\97\02\1a\12\0d\01&\08\19\0b.\030\01\02\04\02\02'\01C\06\02\02\02\02\0c\01\08\01/\013\01\01\03\02\02\05\02\01\01*\02\08\01\ee\01\02\01\04\01\00\01\00\10\10\10\00\02\00\01\e2\01\95\05\00\03\01\02\05\04(\03\04\01\a5\02\00\04\00\02\99\0b1\04{\016\0f)\01\02\02\0a\031\04\02\02\07\01=\03$\05\01\08>\01\0c\024\09\0a\04\02\01_\03\02\01\01\02\06\01\a0\01\03\08\15\029\02\01\01\01\01\16\01\0e\07\03\05\c3\08\02\03\01\01\17\01Q\01\02\06\01\01\02\01\01\02\01\02\eb\01\02\04\06\02\01\02\1b\02U\08\02\01\01\02j\01\01\01\02\06\01\01e\03\02\04\01\05\00\09\01\02\f5\01\0a\02\01\01\04\01\90\04\02\02\04\01 \0a(\06\02\04\08\01\09\06\02\03.\0d\01\02\00\07\01\06\01\01R\16\02\07\01\02\01\02z\06\03\01\01\02\01\07\01\01H\02\03\01\01\01\00\02\00\05;\07\00\01?\04Q\01\00\02\00.\02\17\00\01\01\03\04\05\08\08\02\07\1e\04\94\03\007\042\08\01\0e\01\16\05\01\0f\00\07\01\11\02\07\01\02\01\05\00\07\00\01=\04\00\07m\07\00`\80\f0\00\00\16\00\00\00\0c\00\00\00\04\00\00\00\17\00\00\00Failed to deserialize buffersrc/w3/mutation/wrapped.rs\00\008\10\10\00\1a\00\00\00\0d\00\00\008\00\00\008\10\10\00\1a\00\00\00\15\00\00\00A\00\00\00mutationMethodabstractMutationMethod\18\00\00\00\0c\00\00\00\04\00\00\00\19\00\00\00called `Result::unwrap()` on an `Err` valueFailed to create new data view/linked-packages/polywrap-wasm-rs/src/msgpack/read_decoder.rs\00\00\f1\10\10\00=\00\00\00\11\00\00\00\12\00\00\00DataView::new():  [ byte_length:  byte_offset:  buffer.byte_length:  ]\00\00@\11\10\00\11\00\00\00Q\11\10\00\10\00\00\00a\11\10\00\0e\00\00\00o\11\10\00\15\00\00\00\84\11\10\00\02\00\00\00Invalid length\00\00\b0\11\10\00\0e\00\00\00/linked-packages/polywrap-wasm-rs/src/msgpack/data_view.rs\00\00\c8\11\10\00:\00\00\00.\00\00\00\17\00\00\00\1a\00\00\00\0c\00\00\00\04\00\00\00\1b\00\00\00Error creating new data view/linked-packages/polywrap-wasm-rs/src/msgpack/write_encoder.rs\00\00@\12\10\00>\00\00\00\11\00\00\00\12\00\00\00assertion failed: mid <= self.len()/rustc/6bda5b331cfe7e04e1fe348c58a928fc2b650f4f/library/core/src/slice/mod.rs\b3\12\10\00M\00\00\00\fd\05\00\00\09\00\00\00attempt to join into collection with len > usize::MAX/rustc/6bda5b331cfe7e04e1fe348c58a928fc2b650f4f/library/alloc/src/str.rs\00\00\00E\13\10\00H\00\00\00\ab\00\00\00\0a\00\00\00E\13\10\00H\00\00\00\ba\00\00\00\16\00\00\00\04\00\00\00\00\00\00\00context description not setError: tried to pop an item from an empty Context stack\00\00\d3\13\10\007\00\00\00/linked-packages/polywrap-wasm-rs/src/msgpack/context.rs\14\14\10\008\00\00\00$\00\00\00\0d\00\00\00\0a\00\00\00\00\15\10\00\00\00\00\00 \00\00\00h\14\10\00\01\00\00\00\00\00\00\00 \00\00\00\00\00\00\00\02\00\00\00\00\00\00\00\01\00\00\00\01\00\00\00\03\00\00\00\5c\14\10\00\01\00\00\00Context: context stack is emptyat  :  >> \00\00\00\bb\14\10\00\03\00\00\00\be\14\10\00\03\00\00\00\c1\14\10\00\04\00\00\00Could not find invoke function \00called `Option::unwrap()` on a `None` value\00\01\00\00\00\00\00\00\00library/std/src/panicking.rs4\15\10\00\1c\00\00\00\f1\01\00\00\1e"))
